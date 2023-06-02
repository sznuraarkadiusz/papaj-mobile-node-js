import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";
import axios from "axios";

interface CurrencyRate {
    code: string;
}

const displayCurrencyHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.INTERNAL_SERVER_ERROR,
        execute: async () => {
            const response = await axios.get("http://api.nbp.pl/api/exchangerates/tables/A");
            const currencyRates: CurrencyRate[] = response.data[0].rates;

            const filteredRates = currencyRates.filter(rate => {
                return rate.code === "USD" || rate.code === "EUR" || rate.code === "GBP";
            });

            return filteredRates;
        },
    });

export default {
    method: "get",
    path: "/api/currency",
    validators: [],
    handler: displayCurrencyHandler,
} as TRoute;
