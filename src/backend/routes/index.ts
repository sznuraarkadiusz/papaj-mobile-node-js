import express from "express";
import getStatus from "./status/get.status";
import loginUser from "./user/login.user";
import registerUser from "./user/register.user";
import addCar from "./car/add.car";
import deleteCar from "./car/delete.car";
import editCar from "./car/edit.car";
import listCar from "./car/list.car";
import reservationList from "./reservation/reservation.list";
import reservationAdd from "./reservation/reservation.add";
import reservationDelete from "./reservation/reservation.delete";
import reservationEdit from "./reservation/reservation.edit";
import userInfo from "./user/info.user";

const router = express.Router();

const apiRoutes = [
    getStatus,
    userInfo,
    loginUser,
    registerUser,
    addCar,
    deleteCar,
    editCar,
    listCar,
    reservationAdd,
    reservationDelete,
    reservationEdit,
    reservationList,
];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
