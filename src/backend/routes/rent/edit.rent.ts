import { Request, Response } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const editRentValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const editRentHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { customerId, carId, price, rentDate, returnDate } = req.body;
            const rentId = Number(req.params.id);
            const existingRent = await prisma.rent.findUnique({
                where: { id: rentId },
            });

            const car = await prisma.car.findUnique({
                where: { id: carId },
            });

            if (!existingRent) {
                throw {
                    isCustomError: true,
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono wypożyczenia o podanym id.",
                } as TCustomError;
            }

            if (!car) {
                throw {
                    isCustomError: true,
                    status: StatusCodes.CONFLICT,
                    message: "Nie znaleziono samochodu o podanym id.",
                } as TCustomError;
            } else if (car.isAvailable === false) {
                throw {
                    isCustomError: true,
                    status: StatusCodes.CONFLICT,
                    message: "Samochód o podanym id nie jest dostępny.",
                } as TCustomError;
            }

            const updatedRent = await prisma.rent.update({
                where: { id: rentId },
                data: {
                    rentedBy: { connect: { id: customerId } },
                    car: { connect: { id: carId } },
                    price,
                    rentDate,
                    returnDate,
                },
            });

            return { updatedRent };
        },
    });

export default {
    method: "put",
    path: "/api/rent/:id",
    validators: editRentValidators,
    handler: editRentHandler,
} as TRoute;
