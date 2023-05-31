import { Request, Response } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const editCarValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const editCarHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { brand, model, color, productionYear, price, isAvailable } =
                req.body;
            const carId = Number(req.params.id);
            const existingCar = await prisma.car.findUnique({
                where: { id: carId },
            });

            if (!existingCar) {
                throw {
                    isCustomError: true,
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono samochodu o podanym id.",
                } as TCustomError;
            }

            const updatedCar = await prisma.car.update({
                where: { id: carId },
                data: {
                    brand,
                    model,
                    color,
                    productionYear,
                    price,
                    isAvailable,
                },
            });

            return updatedCar;
        },
    });

export default {
    method: "put",
    path: "/api/car/edit/:id",
    validators: editCarValidators,
    handler: editCarHandler,
} as TRoute;
