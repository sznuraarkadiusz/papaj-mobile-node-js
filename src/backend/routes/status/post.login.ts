import sqlite3 from "sqlite3";
import { open } from "sqlite";
import session, { SessionData } from "express-session";
import { Request, RequestHandler } from "express";

declare module "express-session" {
    interface SessionData {
        user: any;
    }
}

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const login: RequestHandler = async (req: Request, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Nieprawidłowe dane logowania" });
    }

    const db = await openDatabase();

    try {
        const user = await db.get(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password]
        );

        if (!user) {
            return res.status(401).json({ error: "Nieprawidłowe dane logowania" });
        }

        // Utwórz sesję i przypisz użytkownika do sesji
        req.session.user = user;

        return res.status(200).json({ message: "Logowanie zakończone sukcesem" });
    } catch (error) {
        console.error("Błąd logowania:", error);
        return res.status(500).json({ error: "Wystąpił błąd logowania" });
    } finally {
        await db.close();
    }
};
