import { Request, Response } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const editReservationValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const editReservationHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { userId, carId, reservationDate, reservationReturnDate } =
                req.body;
            const reservationId = Number(req.params.id);
            const existingReservation = await prisma.reservation.findUnique({
                where: { reservationId: reservationId },
            });

            if (!existingReservation) {
                throw {
                    isCustomError: true,
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono rezerwacji o podanym id.",
                } as TCustomError;
            }

            const updatedReservation = await prisma.reservation.update({
                where: { reservationId: reservationId },
                data: {
                    userId,
                    carId,
                    reservationDate,
                    reservationReturnDate,
                },
            });

            return { updatedReservation };
        },
    });

export default {
    method: "put",
    path: "/api/reservation/edit/:id",
    validators: editReservationValidators,
    handler: editReservationHandler,
} as TRoute;
