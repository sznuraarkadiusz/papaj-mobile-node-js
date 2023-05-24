import { TServerConfig } from "./server";

export type TEvn = "production" | "test" | "development";

export type TConfig = {
    env: TEvn;
    server: TServerConfig;
};

const env = (process.env.NOde_ENV || "production") as TEvn;
const API_PORT = 3000;

export const config: TConfig = {
    env,
    server: {
        port: API_PORT,
        corsOptions:
            env == "development" ? { origin: "localhost:" + API_PORT } : {},
        limiter: {
            time: 15 * 60 * 1000,
            max: 250,
        },
    },
};
