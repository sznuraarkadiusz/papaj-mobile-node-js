import { Response, Request } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";

const addCarValidators = [
    authorize,
    isAdminMiddleware,
    body("brand").not().isEmpty(),
    body("model").not().isEmpty(),
    body("color").not().isEmpty(),
    body("productionYear").not().isEmpty(),
    body("price").not().isEmpty(),
];

const addCarHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { brand, model, color, productionYear, price } = req.body;
            const car = await prisma.car.create({
                data: {
                    brand,
                    model,
                    color,
                    productionYear,
                    price,
                },
            });
            return {
                car,
            };
        },
    });

export default {
    method: "post",
    path: "/api/car",
    validators: addCarValidators,
    handler: addCarHandler,
} as TRoute;
