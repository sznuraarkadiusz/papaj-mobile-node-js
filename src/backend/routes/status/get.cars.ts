import { Request, Response, RequestHandler } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDatabase() {
    return open({
        filename: "database",
        driver: sqlite3.Database,
    });
}

export const getCar: RequestHandler = async (req: Request, res: Response) => {
    const db = await openDatabase();

    try {
        const car = await db.all("SELECT * FROM car WHERE isAvailable = 1");

        return res.status(200).json(car);
    } catch (error) {
        console.error("Błąd pobierania samochodów:", error);
        return res
            .status(500)
            .json({ error: "Wystąpił błąd pobierania samochodów" });
    } finally {
        await db.close();
    }
};

export const getCarDetails: RequestHandler = async (
    req: Request,
    res: Response
) => {
    const carId = req.params.carId;

    const db = await openDatabase();

    try {
        const car = await db.get("SELECT * FROM car WHERE id = ?", [carId]);

        if (!car) {
            return res.status(404).json({ error: "Samochód nie został znaleziony" });
        }

        return res.status(200).json(car);
    } catch (error) {
        console.error("Błąd pobierania szczegółowych informacji o samochodzie:", error);
        return res
            .status(500)
            .json({ error: "Wystąpił błąd pobierania szczegółowych informacji o samochodzie" });
    } finally {
        await db.close();
    }
};
