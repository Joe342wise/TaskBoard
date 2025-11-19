import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

import * as authSchema from "@/db/schema/auth-schema";

// Combine all schemas into a single object

const schema = {
  ...authSchema,
};

const client = postgres(env.DATABASE_URL, {
  prepare: false,
});

const db = drizzle(client, {
  schema: {
    ...schema,
  },
});

export default db;
