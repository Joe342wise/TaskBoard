import { serve } from "@hono/node-server";

import { auth } from "./lib/auth"; // path to your auth file

import app from "./app";
import env from "./env";

const port = env.PORT;
// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const server = serve({
  fetch: (req: Request) => app.fetch(req),
  port,
  hostname: "0.0.0.0",
});

export default server;
