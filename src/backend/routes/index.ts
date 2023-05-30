import express from "express";
import getStatus from "./status/get.status";
import loginUser from "./user/login.user";
import registerUser from "./user/register.user";
import addCar from "./car/car.add";
import deleteCar from "./car/car.delete";
import editCar from "./car/car.edit";
import listCar from "./car/car.list";
import reservationsList from "./reservation/reservation.list";
import reservationAdd from "./reservation/reservation.add";

const router = express.Router();

const apiRoutes = [
    getStatus,
    loginUser,
    registerUser,
    addCar,
    deleteCar,
    editCar,
    listCar,
    reservationAdd,
    reservationsList,
];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
