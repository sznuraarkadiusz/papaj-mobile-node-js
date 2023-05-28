import { Response, Request } from "express";
import { body } from "express-validator";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { createHash } from "../../utils/hash.utils";
import { createToken } from "../../utils/jwt.utils";

const SALT = (process.env.PASSWORD_SALT as string) ?? "XYZ";
const SECRET = (process.env.PASSWORD_SECRET as string) ?? "XYZ";

const addCarValidators = [
    body("brand").not().isEmpty(),
    body("model").not().isEmpty(),
    body("color").not().isEmpty(),
    body("productionYear").not().isEmpty(),
    body("price").not().isEmpty(),
];

export default {
    method: "post",
    path: "/api/car/add",
    validators: addCarValidators,
};
