import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../../get-payload";
import { stripe } from "../../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        productQuantities: z.array(
          z.object({ id: z.string(), quantity: z.number() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      let { productIds, productQuantities } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          user: user.id,
          orderedProducts: productQuantities.map((prod) => {
            // if you wonder why we're not using the "products" array here, read the collections/Orders/index.tsx comments :)
            return {
              product: prod.id,
              quantity: prod.quantity,
            };
          }),
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      // filteredProducts.forEach((product) => {
      //   line_items.push({
      //     price: product.priceId!,
      //     quantity: 1,
      //   });
      // });

      filteredProducts.forEach((product) => {
        const selectedItem = productQuantities.find(
          (prod) => prod.id === product.id
        );
        const quantity = selectedItem?.quantity || 1;
        line_items.push({
          price: product.priceId!,
          quantity,
        });
      });

      line_items.push({
        price: "price_1OMRM1B2rnUmx5fRD3Cjudar",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (err) {
        console.error(err);
        return { url: null };
      }
    }),
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: "orders",
        where: {
          id: {
            equals: orderId,
          },
        },
      });

      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [order] = orders;

      return { isPaid: order._isPaid };
    }),
});
