import { Response, Request } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const deleteCarValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const deleteCarHandler = async (req: Request, res: Response) =>
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
            const reservationId = await prisma.reservation.findFirst({
                where: { carId: carId },
            });
            const rentId = await prisma.rent.findFirst({
                where: { carId: carId },
            });

            if (!existingCar) {
                throw {
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono samochodu o podanym id",
                    isCustomError: true,
                } as TCustomError;
            } else if (reservationId) {
                throw {
                    status: StatusCodes.BAD_REQUEST,
                    message:
                        "Nie można usunąć samochodu, który jest aktualnie zarezerwowany",
                    isCustomError: true,
                } as TCustomError;
            } else if (rentId) {
                throw {
                    status: StatusCodes.BAD_REQUEST,
                    message:
                        "Nie można usunąć samochodu, który jest aktualnie wypożyczony",
                    isCustomError: true,
                } as TCustomError;
            }

            await prisma.car.delete({
                where: { id: carId },
            });
        },
    });

export default {
    method: "delete",
    path: "/api/car/delete/:id",
    validators: deleteCarValidators,
    handler: deleteCarHandler,
} as TRoute;
