import createApp from "@/lib/create-app";
import index from "@/routes/index";
import { showRoutes } from "hono/dev";
import { cors } from "hono/cors";
import configureOpenAPI from "@/lib/configure-open-api";
import { auth } from "@/lib/auth";

import { authMiddleware } from "@/middlewares/auth";

const app = createApp();

// Enable CORS for all origins (safe for local testing, not for prod)
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

configureOpenAPI(app);

const publicRoutes = [] as const;

const routes = [index] as const;

for (const route of publicRoutes) {
  app.route("/api", route);
}

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use("/api/*", authMiddleware());

for (const route of routes) {
  app.route("/api", route);
}

showRoutes(app);

export type AppType = (typeof routes)[number];

export default app;
