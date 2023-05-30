import express from "express";
import getStatus from "./status/get.status";
import loginUser from "./user/login.user";
import registerUser from "./user/register.user";
import addCar from "./car/add.car";
import deleteCar from "./car/delete.car";
import editCar from "./car/edit.car";
import listCar from "./car/list.car";

const router = express.Router();

const apiRoutes = [
    getStatus,
    loginUser,
    registerUser,
    addCar,
    deleteCar,
    editCar,
    listCar,
];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
