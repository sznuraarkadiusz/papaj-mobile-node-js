import { Response, Request } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const removeCarValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const removeCarHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.NO_CONTENT,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const carId = Number(req.params.id);
            const existingCar = await prisma.car.findUnique({
                where: { id: carId },
            });

            if (!existingCar) {
                throw {
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono samochodu o podanym id",
                    isCustomError: true,
                } as TCustomError;
            }

            await prisma.car.delete({
                where: { id: carId },
            });

            return null;
        },
    });

export default {
    method: "delete",
    path: "/api/car/delete/:id",
    validators: removeCarValidators,
    handler: removeCarHandler,
} as TRoute;
