import express from "express";
import getStatus from "./status/get.status";

const router = express.Router();

const apiRoutes = [getStatus];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
