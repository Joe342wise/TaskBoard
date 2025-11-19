import { auth } from "@/lib/auth";
import type { OpenAPIHono, RouteHandler } from "@hono/zod-openapi";
import type { createRoute } from "@hono/zod-openapi";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    session: typeof auth.$Infer.Session;
  };
}

// these two pieces of code do the same thing
// NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["session"];
// const a = typeof auth.$Infer.Session

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends ReturnType<typeof createRoute>> =
  RouteHandler<R, AppBindings>;
