import { Request, Response } from "express";
import { TRoute } from "../types";

export default {
    method: "get",
    path: "/api/status",
    validators: [],
    handler: async (req: Request, res: Response) => {
        res.send("Server is working!");
    },
} as TRoute;
