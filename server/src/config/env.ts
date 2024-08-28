import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

const EnvSchema = z.object({
    NODE_ENV: z.string().default("development"),
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number(),
    JWT_KEY: z.string(),
    SITE_URL: z.string(),
})

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config());

let parsedEnv: EnvSchema;
try {
    parsedEnv = EnvSchema.parse(process.env);
    console.log("Parsed environment variables:", parsedEnv);
} catch (error) {
    if (error instanceof ZodError) {
        let message = "Missing required values in .env:\n";
        error.issues.forEach((issue) => {
            message += issue.path[0] + "\n";
        });
        const e = new Error(message);
        e.stack = "";
        throw e;
    } else {
        console.error(error);
        throw error;
    }
}

export default parsedEnv;
