import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { param } from "express-validator";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { TCarInfo } from "./types.car";

const getCarInfoValidators = [param("id").isInt({ min: 1 }).not().isEmpty()];

const getCarInfoHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const carId = Number(req.params.id);
            let averageRate: number;
            const carInfo = await prisma.car.findUnique({
                where: { id: carId },
            });

            let car: TCarInfo;

            if (!carInfo) {
                throw {
                    status: StatusCodes.NOT_FOUND,
                    message: "Nie znaleziono samochodu o podanym id",
                    isCustomError: true,
                } as TCustomError;
            } else {
                carInfo.numberOfRates === 0
                    ? (averageRate = 0)
                    : (averageRate = carInfo.rate / carInfo.numberOfRates);
                car = {
                    id: carInfo.id,
                    brand: carInfo.brand,
                    model: carInfo.model,
                    year: carInfo.productionYear,
                    color: carInfo.color,
                    price: carInfo.price,
                    isAvailable: carInfo.isAvailable,
                    averageRate: averageRate,
                };
            }
            car.averageRate = averageRate;

            return {
                info: car,
            };
        },
    });

export default {
    method: "get",
    path: "/api/car/:id",
    validators: getCarInfoValidators,
    handler: getCarInfoHandler,
} as TRoute;
