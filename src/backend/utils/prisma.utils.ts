import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export type TPrismaErrorDescription = {
    uniqueConstraintFailed?: string;
};

export type TPrismaErrorResponse = {
    statusCode: number;
    message: string;
};

const getPrismaErrorReason = (message?: string): TPrismaErrorResponse => {
    return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: message ?? ReasonPhrases.BAD_REQUEST,
    };
};

export const checkPrismaError = (
    err: unknown,
    messages?: TPrismaErrorDescription,
): TPrismaErrorResponse => {
    const response = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };

    if (err instanceof PrismaClientKnownRequestError) {
        const code = err.code;

        switch (code) {
            case "P2002":
                return getPrismaErrorReason(messages?.uniqueConstraintFailed);
        }
    }

    return response;
};
