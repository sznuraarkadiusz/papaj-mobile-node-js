import express from "express";
import session from "express-session";
import { getStatus } from "./status/get.status";
import { register } from "./status/post.register";
import { login } from "./status/post.login";
import { logout } from "./status/post.logout";
import { getUser } from "./status/get.user";
import { getCar, getCarDetails } from "./status/get.cars";
import { createReservation, deleteReservation, getReservations } from "./status/post.reservations";

//
import { rentCar } from "./status/post.rentCar";

const router = express.Router();

// Dodaj middleware sesji
router.use(
    session({
        secret: "secret-key", // Klucz sesji
        resave: false,
        saveUninitialized: true,
    })
);

// Middleware do logowania czasu
router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

// Strona główna
router.get("/", (req, res) => {
    res.send("Example home page");
});

// Endpointy API
router.get("/api/status", getStatus);
router.post("/api/register", register);
router.post("/api/login", login);
router.post("/api/logout", logout);
router.get("/api/cars", getCar);
router.get("/api/user/:userId", getUser);
router.get("/api/cars/:carId", getCarDetails);
router.post("/api/reservations", createReservation);
router.delete("/api/reservations/:reservationId", deleteReservation);
router.get("/api/reservations", getReservations);
//
router.post("/api/rent", rentCar);

export default router;
