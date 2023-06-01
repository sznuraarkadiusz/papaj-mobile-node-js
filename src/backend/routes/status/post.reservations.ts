import { Request, Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const createReservation = async (req: Request, res: Response) => {
    // Pobierz dane z żądania
    const { userId, carId, startDate, endDate } = req.body;

    // Sprawdź, czy podano wszystkie wymagane dane
    if (!userId || !carId || !startDate || !endDate) {
        return res.status(400).json({ error: "Nieprawidłowe dane rezerwacji" });
    }

    const db = await openDatabase();

    try {
        // Sprawdź, czy użytkownik i samochód istnieją w bazie danych
        const user = await db.get("SELECT * FROM users WHERE userId = ?", [userId]);
        const car = await db.get("SELECT * FROM car WHERE id = ?", [carId]);

        if (!user || !car) {
            return res.status(404).json({ error: "Użytkownik lub samochód nie istnieje" });
        }

        // Sprawdź, czy samochód jest dostępny w podanym zakresie dat
        const existingReservation = await db.get(
            "SELECT * FROM reservations WHERE carId = ? AND startDate <= ? AND endDate >= ?",
            [carId, endDate, startDate]
        );

        if (existingReservation) {
            return res.status(409).json({ error: "Samochód jest już zarezerwowany w podanym terminie" });
        }

        // Sprawdź, czy data oddania samochodu nie jest wcześniejsza niż data wypożyczenia
        if (endDate < startDate) {
            return res.status(400).json({ error: "Data oddania samochodu nie może być wcześniejsza niż data wypożyczenia" });
        }

        // Utwórz nową rezerwację w bazie danych
        const result = await db.run(
            "INSERT INTO reservations (startDate, endDate, userId, carId) VALUES (?, ?, ?, ?)",
            [startDate, endDate, userId, carId]
        );

        const reservationId = result.lastID;

        // Pobierz utworzoną rezerwację
        const reservation = await db.get("SELECT * FROM reservations WHERE id = ?", [reservationId]);

        return res.status(200).json(reservation);
    } catch (error) {
        console.error("Błąd tworzenia rezerwacji:", error);
        return res.status(500).json({ error: "Wystąpił błąd tworzenia rezerwacji" });
    } finally {
        await db.close();
    }
};

export const deleteReservation = async (req: Request, res: Response) => {
    // Pobierz id rezerwacji z parametrów ścieżki
    const reservationId = req.params.reservationId;

    const db = await openDatabase();

    try {
        // Sprawdź, czy rezerwacja istnieje
        const existingReservation = await db.get("SELECT * FROM reservations WHERE id = ?", [reservationId]);

        if (!existingReservation) {
            return res.status(404).json({ error: "Rezerwacja nie istnieje" });
        }

        // Usuń rezerwację z bazy danych
        await db.run("DELETE FROM reservations WHERE id = ?", [reservationId]);

        return res.status(200).json({ message: "Rezerwacja została usunięta" });
    } catch (error) {
        console.error("Błąd usuwania rezerwacji:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas usuwania rezerwacji" });
    } finally {
        await db.close();
    }
};

export const getReservations = async (req: Request, res: Response) => {
    // Pobierz id użytkownika z sesji
    const userId = req.session.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: "Brak autoryzacji" });
    }

    const db = await openDatabase();

    try {
        // Pobierz listę rezerwacji dla danego użytkownika
        const reservations = await db.all("SELECT * FROM reservations WHERE userId = ?", [userId]);

        return res.status(200).json(reservations);
    } catch (error) {
        console.error("Błąd pobierania rezerwacji:", error);
        return res.status(500).json({ error: "Wystąpił błąd podczas pobierania rezerwacji" });
    } finally {
        await db.close();
    }
};