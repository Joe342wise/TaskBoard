import type { Context } from "hono";
import type { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";
import env from "@/env";
import { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  statusCode: ContentfulStatusCode;
  status: "fail" | "error";
  cause?: unknown;

  constructor(
    message: string,
    statusCode: ContentfulStatusCode,
    options?: { cause?: unknown; status?: "fail" | "error" },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status =
      options?.status ??
      (statusCode >= 400 && statusCode < 500 ? "fail" : "error");
    this.cause = options?.cause;

    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static notFound(message = "Not Found", cause?: unknown) {
    return new AppError(message, HttpStatusCodes.NOT_FOUND, { cause });
  }

  static internal(message = "Internal Server Error", cause?: unknown) {
    return new AppError(message, HttpStatusCodes.INTERNAL_SERVER_ERROR, {
      cause,
    });
  }
}

export function errorHandler(
  err: Error | AppError | HTTPException,
  c: Context,
): Response | Promise<Response> {
  const statusCode =
    "statusCode" in err
      ? (err as any).statusCode
      : "status" in err
        ? (err as any).status
        : HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const message = err.message || "Internal Server Error";

  const errorPayload: Record<string, unknown> = { message };

  if (env.NODE_ENV === "development") {
    errorPayload.stack = err.stack;
    if ("cause" in err && err.cause) {
      errorPayload.cause = err.cause;
    }
  }

  return c.json(
    {
      success: false,
      error: errorPayload,
    },
    { status: statusCode },
  );
}
