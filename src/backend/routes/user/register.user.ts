import { Response, Request } from "express";
import { body } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../database";
import { TRoute } from "../types";
import { handleRequest, TCustomError } from "../../utils/request.utils";
import { createHash } from "../../utils/hash.utils";
import { createToken } from "../../utils/jwt.utils";

const SALT = (process.env.PASSWORD_SALT as string) ?? "XYZ";
const SECRET = (process.env.PASSWORD_SECRET as string) ?? "XYZ";

const registrationValidators = [
    body("name").not().isEmpty(),
    body("surname").not().isEmpty(),
    body("email").isEmail(),
    body("password").not().isEmpty(),
    body("phone").not().isEmpty(),
];

const registrationHandler = async (req: Request, res: Response) =>
    handleRequest({
        req,
        res,
        responseSuccessStatus: StatusCodes.CREATED,
        responseFailStatus: StatusCodes.BAD_REQUEST,
        execute: async () => {
            const { name, surname, email, password, phone } = req.body;
            const passwordHash = createHash(password, SALT);
            const existingUser = await prisma.user.findFirst({
                where: { email },
            });

            if (existingUser) {
                throw {
                    status: StatusCodes.CONFLICT,
                    message: "Użytkownik o podanym adresie email już istnieje",
                    isCustomError: true,
                } as TCustomError;
            }

            const newUser = await prisma.user.create({
                data: {
                    name,
                    surname,
                    email,
                    password: passwordHash,
                    phone,
                },
            });
            return {
                token: createToken(newUser, SECRET, "7d"),
            };
        },
    });

export default {
    method: "post",
    path: "/api/register",
    validators: registrationValidators,
    handler: registrationHandler,
} as TRoute;
