import { Response, Request } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";

const addReservationValidators = [
    body("reservationDate").not().isEmpty(),
    body("reservationReturnDate").not().isEmpty(),
    body("userId").not().isEmpty(),
    body("carId").not().isEmpty(),
];

const addReservationHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { userId, carId, reservationDate, reservationReturnDate } =
                req.body;
            const reservation = await prisma.reservation.create({
                data: {
                    userId,
                    carId,
                    reservationDate,
                    reservationReturnDate,
                },
            });
            const carAvailibility = await prisma.car.findFirst({
                where: { id: carId },
            });

            if (!carAvailibility?.isAvailable) {
                throw {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Wybrany samochód jest niedostępny",
                    isCustomError: true,
                } as TCustomError;
            } else {
                await prisma.car.update({
                    where: { id: carId },
                    data: { isAvailable: false },
                });
            }

            return {
                reservation,
            };
        },
    });
export default {
    method: "post",
    path: "/api/reservation/add",
    validators: addReservationValidators,
    handler: addReservationHandler,
} as TRoute;
