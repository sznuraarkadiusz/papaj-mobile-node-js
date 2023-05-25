import { RequestHandler } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const login: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Nieprawidłowe dane logowania" });
    }

    const db = await openDatabase();

    try {
        const user = await db.get(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password],
        );

        if (!user) {
            return res
                .status(401)
                .json({ error: "Nieprawidłowe dane logowania" });
        }

        return res
            .status(200)
            .json({ message: "Logowanie zakończone sukcesem" });
    } catch (error) {
        console.error("Błąd logowania:", error);
        return res.status(500).json({ error: "Wystąpił błąd logowania" });
    } finally {
        await db.close();
    }
};
