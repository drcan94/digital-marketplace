import { router } from "./trpc";
import { authRouter } from "./auth-router";
import { paymentRouter } from "./payment-router";
import { infiniteProductsRouter } from "./infinite-products-router";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  infiniteProducts: infiniteProductsRouter,
});

export type AppRouter = typeof appRouter;
