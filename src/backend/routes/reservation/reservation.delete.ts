import { Response, Request } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const deleteReservationValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const deleteReservationHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const reservationId = Number(req.params.id);
            const existingReservation = await prisma.reservation.findUnique({
                where: { reservationId: reservationId },
            });

            if (!existingReservation) {
                throw {
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono rezerwacji o podanym id.",
                    isCustomError: true,
                } as TCustomError;
            }

            await prisma.reservation.delete({
                where: { reservationId: reservationId },
            });
        },
    });

export default {
    method: "delete",
    path: "/api/reservation/delete/:id",
    validators: deleteReservationValidators,
    handler: deleteReservationHandler,
} as TRoute;
