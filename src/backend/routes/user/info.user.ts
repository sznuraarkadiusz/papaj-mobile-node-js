import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { param } from "express-validator";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";
import { authorize } from "../../utils/middleware.utils";

const getUserInfoValidators = [
    authorize,
    param("id").not().isEmpty(),
    param("id").isInt({ min: 1 }),
];

const getUserInfoHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const userId = Number(req.params.id);

            const userInfo = await prisma.user.findUnique({
                where: { id: userId },
            });
            return {
                userInfo,
            };
        },
    });

export default {
    method: "get",
    path: "/api/user/:id",
    validators: getUserInfoValidators,
    handler: getUserInfoHandler,
} as TRoute;
