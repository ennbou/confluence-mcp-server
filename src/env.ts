import {z} from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  CONFLUENCE_HOSTNAME: z.string().nonempty(),
  CONFLUENCE_TOKEN: z.string().nonempty(),
});

const env = envSchema.safeParse(process.env);
if (!env.success) {
  console.error("Invalid environment variables:", env.error.format());
  process.exit(1);
}

export default  env.data;