import { TServerConfig } from "./server";

export type TConfig = {
    server: TServerConfig;
};

export const config: TConfig = {
    server: {
        port: 3000,
    },
};
