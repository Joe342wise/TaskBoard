import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types";

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";
import envData from "@/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkgJsonPath = resolve(__dirname, "../../package.json");
const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));

function getServerUrl(): string {
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || "localhost";
  return `http://${host}:${port}`;
}

export default function configureOpenAPI(app: AppOpenAPI) {
  // Serve OpenAPI JSON at /doc
  app.doc("/doc", {
    openapi: "3.1.1",
    info: {
      title: "Orcta Backend Template",
      description: `# Orcta Backend Template API`,
      version: pkg.version,
      termsOfService: "https://orcta.com/terms",
      contact: {
        name: "Orcta Dev Team",
        email: "dev@orcta.com",
        url: "https://orcta.com/contact",
      },
    },
    servers: [
      {
        url: envData.SERVER_URL,
        description: "Production Server",
        variables: {
          version: {
            default: "v1",
            description: "API version",
          },
        },
      },
      {
        url: getServerUrl(),
        description: "Development Server",
      },
    ],
    security: [
      {
        apiKeyCookie: [],
        bearerAuth: [],
        apiKeyHeader: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication, registration, and token management",
      },
      {
        name: "System",
        description: "Health checks, monitoring, and system status",
      },
    ],
  });

  // Serve interactive Scalar API Reference at /reference
  app.get(
    "/reference",
    Scalar({
      theme: "kepler",
      layout: "modern",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
      sources: [
        { url: "/doc", title: "Orcta PSS API" },
        { url: "/api/auth/open-api/generate-schema", title: "Auth" },
      ],
      title: "Orcta PSS API Reference",
      metaData: {
        title: "Orcta PSS",
        description: "Interactive API documentation for the Orcta platform",
        ogDescription: "Explore and test the Orcta API endpoints",
        ogTitle: "Orcta API Documentation",
        twitterCard: "summary_large_image",
      },
      searchHotKey: "k",
      showSidebar: true,
      hideModels: false,
      hideDownloadButton: false,
      hideDarkModeToggle: false,
    }),
  );

  // Serve traditional Swagger UI at /swagger
  app.get(
    "/swagger",
    swaggerUI({
      url: "/doc",
      title: "Orcta PSS API Documentation",
      version: "3.1.0",
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      requestInterceptor: `
        (req) => {
          // Add API key or modify requests if needed
          console.log('Request:', req);
          return req;
        }
      `,
      responseInterceptor: `
        (res) => {
          console.log('Response:', res);
          return res;
        }
      `,
      onComplete: `
        () => {
          console.log('Swagger UI loaded successfully');
        }
      `,
      deepLinking: true,
      displayOperationId: false,
      defaultModelRendering: "example",
      docExpansion: "list",
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      persistAuthorization: true,
    }),
  );
  // Register security schemes none for now

  // Register additional components for better API documentation none for now
}
