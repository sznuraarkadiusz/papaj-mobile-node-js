import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";

const getCarListHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const carList = await prisma.car.findMany();
            return {
                carList,
            };
        },
    });

export default {
    method: "get",
    path: "/api/car/list",
    validators: [],
    handler: getCarListHandler,
} as TRoute;
