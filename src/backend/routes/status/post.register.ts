import { RequestHandler } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const register: RequestHandler = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res
            .status(400)
            .json({ error: "Nieprawidłowe dane rejestracji" });
    }

    const db = await openDatabase();

    try {
        const existingUser = await db.get(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email],
        );

        if (existingUser) {
            return res.status(400).json({
                error: "Użytkownik o podanym username lub email już istnieje",
            });
        }

        await db.run(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            [username, password, email],
        );

        return res
            .status(200)
            .json({ message: "Rejestracja zakończona sukcesem" });
    } catch (error) {
        console.error("Błąd rejestracji:", error);
        return res.status(500).json({ error: "Wystąpił błąd rejestracji" });
    } finally {
        await db.close();
    }
};
