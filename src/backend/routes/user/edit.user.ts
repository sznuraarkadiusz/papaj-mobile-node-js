import { Request, Response } from "express";
import { param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const editUserValidators = [
    authorize,
    isAdminMiddleware,
    param("id").isInt({ min: 1 }),
];

const editUserHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { name, surname, address, email, password, phone, isAdmin } =
                req.body;
            const userId = Number(req.params.id);
            const existingReservation = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!existingReservation) {
                throw {
                    isCustomError: true,
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono użytkownika o podanym id.",
                } as TCustomError;
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    surname,
                    address,
                    email,
                    isAdmin,
                    password,
                    phone,
                },
            });

            return { updatedUser };
        },
    });

export default {
    method: "put",
    path: "/api/user/edit/:id",
    validators: editUserValidators,
    handler: editUserHandler,
} as TRoute;
