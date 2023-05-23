import express from "express";
import { startServer } from "./server";
import { config } from "./config";
import { prisma } from "./database";

async function main() {
    startServer(config.server);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

const router = express.Router();

const apiRoutes = [];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
