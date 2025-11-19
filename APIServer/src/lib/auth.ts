import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [openAPI()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  cookie: {
    secure: process.env.NODE_ENV === "production",
  },
});
