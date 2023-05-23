import express from "express";

export type TServerConfig = {
    port: number;
};

export const startServer = ({ port }: TServerConfig) => {
    const app = express();

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
};
