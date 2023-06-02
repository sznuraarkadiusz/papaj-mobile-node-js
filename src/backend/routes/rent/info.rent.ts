import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { param } from "express-validator";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";

const getRentInfoValidators = [param("id").isInt({ min: 1 }).not().isEmpty()];

const getRentInfoHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const rentId = Number(req.params.id);

            const rentInfo = await prisma.car.findUnique({
                where: { id: rentId },
            });
            return {
                rentInfo,
            };
        },
    });

export default {
    method: "get",
    path: "/api/rent/:id",
    validators: getRentInfoValidators,
    handler: getRentInfoHandler,
} as TRoute;