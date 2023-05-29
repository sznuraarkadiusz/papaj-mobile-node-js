import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt.utils";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { prisma } from "../database";

const SECRET = (process.env.TOKEN_SECRET as string) ?? "XYZ";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const parsedToken = token?.replace("Bearer ", "");
    const result = verifyToken(parsedToken ?? "", SECRET);

    if (!token || !result.isValid) {
        res.sendStatus(StatusCodes.UNAUTHORIZED).json({
            errors: [ReasonPhrases.UNAUTHORIZED],
        });
    } else {
        next();
    }
};

export const isAdminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const userId = req.body.id;
    try {
        const user = await prisma.user.findFirst({
            where: { id: userId },
        });

        if (!user || !user.isAdmin) {
            return res.status(StatusCodes.FORBIDDEN).json({
                errors: [ReasonPhrases.FORBIDDEN],
            });
        }

        next();
    } catch (err) {
        next(err);
    }
};
