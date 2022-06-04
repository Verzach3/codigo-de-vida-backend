import authRouter from "./auth/auth.js";
import rootRouter from "./root.js";

export const routes = [
  {
    path: "/auth",
    router: authRouter
  },
  {
    path: "/",
    router: rootRouter
  }
]