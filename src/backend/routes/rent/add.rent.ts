import { Response, Request } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { authorize, isAdminMiddleware } from "../../utils/middleware.utils";
import { countDaysBetweenDates, dateFormats } from "../../utils/date.utils";

const addRentValidators = [
    authorize,
    isAdminMiddleware,
    body("customerId").not().isEmpty(),
    body("customerId").isInt({ min: 1 }),
    body("carId").not().isEmpty(),
    body("carId").isInt({ min: 1 }),
    body("rentDate").not().isEmpty(),
    body("rentDate").isDate({ format: dateFormats.default }),
    body("returnDate").not().isEmpty(),
    body("returnDate").isDate({ format: dateFormats.default }),
];

const addRentHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { customerId, carId, rentDate, returnDate } = req.body;

            const car = await prisma.car.findUnique({
                where: { id: carId },
            });

            const rentDays = countDaysBetweenDates(rentDate, returnDate);
            let price: number;

            if (!car) {
                throw {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Wybrany samochód nie istnieje w bazie.",
                    isCustomError: true,
                } as TCustomError;
            } else {
                price = car.price * rentDays;
            }

            const rent = await prisma.rent.create({
                data: {
                    customerId,
                    carId,
                    rentDate,
                    returnDate,
                    price: price,
                },
            });
            return {
                rent,
            };
        },
    });

export default {
    method: "post",
    path: "/api/rent/add",
    validators: addRentValidators,
    handler: addRentHandler,
} as TRoute;
