import express from "express";
import cors from "cors";
import helmet from "helmet";
import limit from "express-rate-limit";
import { CorsOptions } from "cors";
import router from "./routes";

export type TServerConfig = {
    port: number;
    corsOptions: CorsOptions;
    limiter: {
        time: number;
        max: number;
    };
};

export const startServer = ({ port, corsOptions, limiter }: TServerConfig) => {
    const app = express();

    app.use(helmet());
    app.use(cors(corsOptions));
    app.disable("x-powered-by");
    app.use(limit({ windowMs: limiter.time, max: limiter.max }));
    app.use(express.json());
    app.use(router);

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
};
