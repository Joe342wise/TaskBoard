import { Context } from "hono";
import { auth } from "@/lib/auth";
import pino from "pino";
const logger = pino();

export function authMiddleware() {
  return async (c: Context, next: () => Promise<void>) => {
    // get session from better auth
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    logger.info({ session }, "Auth session response");

    if (!session?.user) {
      return c.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "User is not authenticated.",
          },
        },
        { status: 401 },
      );
    }

    // store session in context for later use
    c.set("session", session);

    // continue to next middleware or route handler
    await next();
  };
}
