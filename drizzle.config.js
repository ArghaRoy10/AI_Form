import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:4VEjXmoxqHA1@ep-noisy-lab-a52e0w6g.us-east-2.aws.neon.tech/neondb?sslmode=require",
  }
});