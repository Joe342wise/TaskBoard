import type { Context, Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";
import { notFound } from "stoker/middlewares";

import { pinoLogger } from "@/middlewares/pino-logger";
import { errorHandler } from "@/utils/error";

import type { AppBindings, AppOpenAPI } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
  });
}

export function onError(err: Error, c: Context) {
  const logger = c.get("logger");
  logger.error({ err }, "Unhandled application error");
  return errorHandler(err, c);
}

export default function createApp() {
  const app = createRouter();
  app.use(requestId()).use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}
