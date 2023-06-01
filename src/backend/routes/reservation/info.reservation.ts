import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { param } from "express-validator";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";
import { authorize } from "../../utils/middleware.utils";

const getReservationInfoValidators = [
    authorize,
    param("id").not().isEmpty(),
    param("id").isInt({ min: 1 }),
];

const getReservationInfoHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const reservationId = Number(req.params.id);

            const reservationInfo = await prisma.reservation.findUnique({
                where: { reservationId: reservationId },
            });
            return {
                reservationInfo,
            };
        },
    });

export default {
    method: "get",
    path: "/api/reservation/info/:id",
    validators: getReservationInfoValidators,
    handler: getReservationInfoHandler,
} as TRoute;
