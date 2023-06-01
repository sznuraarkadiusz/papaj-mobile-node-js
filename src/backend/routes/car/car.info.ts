import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { param } from "express-validator";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";

const getCarInfoValidators = [
    param("id").not().isEmpty(),
    param("id").isInt({ min: 1 }),
];

const getCarInfoHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const carId = Number(req.params.id);

            const carInfo = await prisma.car.findUnique({
                where: { id: carId },
            });
            return {
                carInfo,
            };
        },
    });

export default {
    method: "get",
    path: "/api/car/info/:id",
    validators: getCarInfoValidators,
    handler: getCarInfoHandler,
} as TRoute;
