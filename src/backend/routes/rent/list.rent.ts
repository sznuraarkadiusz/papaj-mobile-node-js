import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";

const getRentListHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const rentList = await prisma.rent.findMany();
            return {
                rentList,
            };
        },
    });

export default {
    method: "get",
    path: "/api/rents",
    validators: [],
    handler: getRentListHandler,
} as TRoute;
