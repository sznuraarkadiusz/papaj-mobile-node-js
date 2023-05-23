import express from "express";
import { startServer } from "./server";

startServer();

const router = express.Router();

const apiRoutes = [];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
