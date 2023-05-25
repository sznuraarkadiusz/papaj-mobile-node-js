import { RequestHandler } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const rentCar: RequestHandler = async (req, res) => {
    const { carId } = req.params;
    const { days } = req.body;

    if (!days || isNaN(days)) {
        return res.status(400).json({ error: "Nieprawidłowa liczba dni" });
    }

    const db = await openDatabase();

    try {
        // Sprawdzenie czy samochód istnieje
        const car = await db.get("SELECT * FROM car WHERE id = ?", [carId]);

        if (!car) {
            return res.status(404).json({ error: "Samochód nie istnieje" });
        }

        const totalPrice = car.price_per_day * days;

        // Zapis wypożyczenia do tabeli rent
        await db.run(
            "INSERT INTO rent (car_id, days, total_price) VALUES (?, ?, ?)",
            [carId, days, totalPrice],
        );

        return res.status(200).json({
            message: "Wypożyczenie zakończone sukcesem",
            car: `${car.brand} ${car.model}`,
            days,
            totalPrice,
        });
    } catch (error) {
        console.error("Błąd wypożyczenia samochodu:", error);
        return res
            .status(500)
            .json({ error: "Wystąpił błąd wypożyczenia samochodu" });
    } finally {
        await db.close();
    }
};
