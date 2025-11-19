import { AppError } from "@/utils/error";
import { logError } from "@/utils/logger";
import { z } from "zod/v4";

export const ok = <T>(data: T) => ({
  success: true,
  data,
});

export const fail = (error: AppError) => ({
  success: false,
  error: {
    message: error.message,
    statusCode: error.statusCode,
    status: error.status,
    ...(error.cause ? { cause: error.cause } : {}),
  },
});

export type AppResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string | object };

export type Result<T> = { ok: true; value: T } | { ok: false; error: AppError };

// Helper to recursively convert date strings to Date objects
const preprocessDates = (data: any): any => {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Check if it looks like an ISO date string
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (isoDateRegex.test(data)) {
      const date = new Date(data);
      return isNaN(date.getTime()) ? data : date;
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(preprocessDates);
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, preprocessDates(value)]),
    );
  }

  return data;
};

// Flexible ResponseFormat wrapper with automatic date conversion
export const ResponseFormat = <T extends z.ZodType | undefined = undefined>(
  schema?: T,
) => {
  const baseSchema = z.object({
    success: z.boolean().default(true),
    data: schema ? schema.optional() : z.any().optional(),
    error: z.any().optional(),
  });

  // Add preprocessing to handle dates
  return z.preprocess(preprocessDates, baseSchema);
};

// Helper to safely wrap async operations that might throw
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage: string = "Operation failed",
): Promise<Result<T>> {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (error) {
    logError(error, (error as Error).message, {
      method: fn.name,
    });

    if (error instanceof AppError) {
      return { ok: false, error };
    }

    return {
      ok: false,
      error: new AppError(errorMessage, 500, {
        cause: error instanceof Error ? error : undefined,
      }),
    };
  }
}
