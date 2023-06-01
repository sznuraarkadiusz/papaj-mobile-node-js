import { Request, RequestHandler } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const logout: RequestHandler = async (req: Request, res) => {
    // Sprawdź, czy użytkownik jest zalogowany w sesji
    if (req.session.user) {
        const { username } = req.session.user;

        const db = await openDatabase();

        try {
            const user = await db.get(
                "SELECT * FROM users WHERE username = ?",
                [username]
            );

            if (!user) {
                // Użytkownik nie istnieje w bazie danych, co oznacza, że dane się nie zgadzają
                return res.status(401).json({ error: "Dane użytkownika nieprawidłowe" });
            }

            // Usuń użytkownika z sesji
            delete req.session.user;

            // Zwróć odpowiedź zakończenia wylogowania
            return res.status(200).json({ message: "Wylogowanie zakończone sukcesem" });
        } catch (error) {
            console.error("Błąd sprawdzania danych użytkownika:", error);
            return res.status(500).json({ error: "Wystąpił błąd sprawdzania danych użytkownika" });
        } finally {
            await db.close();
        }
    }

    // Zwróć odpowiedź, jeśli użytkownik nie jest zalogowany w sesji
    return res.status(401).json({ error: "Użytkownik niezalogowany" });
};
