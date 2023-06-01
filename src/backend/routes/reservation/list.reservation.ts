import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";

const getReservationListHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const reservationList = await prisma.reservation.findMany();
            return {
                reservationList,
            };
        },
    });

export default {
    method: "get",
    path: "/api/reservation/list",
    validators: [],
    handler: getReservationListHandler,
} as TRoute;
