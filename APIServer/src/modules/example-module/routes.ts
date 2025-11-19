import { createRoute } from "@hono/zod-openapi";
import { z } from "zod/v4";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { ResponseFormat } from "@/lib/response";

const tags = ["example"];

// localized schema example

// looks like this: `${data}`
const exampleInputSchema = z.string();

// looks like this: `Processed: ${data}`
const exampleSchema = z.string();

export const Example = createRoute({
  method: "post",
  path: "/example",
  tags,
  summary: "Example route",
  request: {
    body: jsonContentRequired(exampleInputSchema, "Example input"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ResponseFormat(exampleSchema),
      "Example response",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      ResponseFormat(z.object({ error: z.string() })),
      "Internal Server Error",
    ),
  },
});

export type ExampleRoute = typeof Example;
