import { RequestHandler } from "express";

export const getStatus: RequestHandler = (req, res) => {
    res.send("Server is working!");
};
