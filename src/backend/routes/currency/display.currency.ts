import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TRoute } from "../types";
import { handleRequest } from "../../utils/request.utils";
import axios from "axios";

const displayCurrencyHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.OK,
        responseFailStatus: StatusCodes.INTERNAL_SERVER_ERROR,
        execute: async () => {
            const { waluta } = req.params;

            const response = await axios.get(`http://api.nbp.pl/api/exchangerates/tables/A`);
            const currencyRates = response.data[0].rates;

            const currency = currencyRates.find((rate: any) => rate.code === waluta.toUpperCase());

            if (!currency) {
                return {
                    error: "Nie znaleziono informacji dla podanej waluty.",
                };
            }

            return currency;
        },
    });

export default {
    method: "get",
    path: "/api/currency/:waluta",
    validators: [],
    handler: displayCurrencyHandler,
} as TRoute;
