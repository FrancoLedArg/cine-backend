import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string().transform(Number).default(3000),
    DATABASE_URL: z.url(),
  },
  runtimeEnv: process.env,
});
