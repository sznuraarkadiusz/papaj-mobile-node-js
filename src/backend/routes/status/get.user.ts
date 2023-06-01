import { RequestHandler } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const getUser: RequestHandler = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ error: "Nieprawidłowy identyfikator użytkownika" });
    }

    const db = await openDatabase();

    try {
        const user = await db.get(
            "SELECT * FROM users WHERE userId = ?",
            userId,
        );

        if (!user) {
            return res.status(404).json({ error: "Użytkownik o podanym identyfikatorze nie istnieje" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Błąd pobierania informacji o użytkowniku:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas pobierania informacji o użytkowniku" });
    } finally {
        await db.close();
    }
};
