import { Request, Response } from "express";
import { body, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";
import { date } from "../../utils/date.utils";

const editCarValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
    body("brand").isString(),
    body("model").isString(),
    body("color").isString(),
    body("productionYear").isInt({ min: 2015, max: date.getFullYear() }),
    body("price").isInt({ min: 0 }),
    body("isAvailable").isBoolean(),
    body("rate").isInt({ min: 1, max: 5 }),
];

const editCarHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const {
                brand,
                model,
                color,
                productionYear,
                price,
                isAvailable,
                rate,
            } = req.body;
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
                    rate: existingCar.rate + rate,
                    numberOfRates: existingCar.numberOfRates + 1,
                },
            });

            return { updatedCar };
        },
    });

export default {
    method: "put",
    path: "/api/car/:id",
    validators: editCarValidators,
    handler: editCarHandler,
} as TRoute;
