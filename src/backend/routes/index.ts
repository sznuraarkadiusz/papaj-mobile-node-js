import express from "express";
import { getStatus } from "./status/get.status";

const router = express.Router();

router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

router.get("/api/status", getStatus);

export default router;
