import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import type { ExampleRoute } from "./routes";

import exampleService from "./services";

import { fail, ok } from "@/lib/response";

export const exampleHandler: AppRouteHandler<ExampleRoute> = async (c) => {
  const inputData = c.req.valid("json");
  const result = await exampleService.someCoolService(inputData);

  if (!result.ok) {
    return c.json(fail(result.error), HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(ok(result.value), HttpStatusCodes.OK);
};
