import express from "express";
import helmet from "helmet";
import cors from "cors";
import limit from "express-rate-limit";
import { CorsOptions } from "cors";
import router from "./routes";
import { openDatabase } from "./database";

export type TServerConfig = {
    port: number;
    corsOptions: CorsOptions;
    limiter: {
        time: number;
        max: number;
    };
};

export const startServer = async ({
    port,
    corsOptions,
    limiter,
}: TServerConfig) => {
    const app = express();

    app.use(helmet());
    app.use(cors(corsOptions));
    app.disable("x-powered-by");
    app.use(limit({ windowMs: limiter.time, max: limiter.max }));
    app.use(express.json());

    // Open the database connection
    const db = await openDatabase();

    // Execute any necessary operations
    await db.exec(`
        -- Your SQL statements here
    `);

    // Close the database connection
    await db.close();

    app.use(router);

    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};
