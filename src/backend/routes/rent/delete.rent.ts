import { Response, Request } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const deleteRentValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const deleteRentHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.NO_CONTENT,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const rentId = Number(req.params.id);
            const existingRent = await prisma.rent.findUnique({
                where: { id: rentId },
            });

            if (!existingRent) {
                throw {
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono wynajmu o podanym id",
                    isCustomError: true,
                } as TCustomError;
            }

            await prisma.car.update({
                where: { id: existingRent.carId },
                data: { isAvailable: true },
            });

            await prisma.rent.delete({
                where: { id: rentId },
            });
        },
    });

export default {
    method: "delete",
    path: "/api/rent/:id",
    validators: deleteRentValidators,
    handler: deleteRentHandler,
} as TRoute;
