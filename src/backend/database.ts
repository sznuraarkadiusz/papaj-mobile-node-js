import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const openDatabase = (): Promise<sqlite3.Database> => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database("database.sqlite", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
};
