import { router } from "./trpc";
import { authRouter } from "./routers/auth-router";
import { paymentRouter } from "./routers/payment-router";
import { infiniteProductsRouter } from "./routers/infinite-products-router";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  infiniteProducts: infiniteProductsRouter,
});

export type AppRouter = typeof appRouter;
