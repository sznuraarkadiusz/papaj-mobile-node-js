import express from "express";
import getStatus from "./status/get.status";
import loginUser from "./user/login.user";
import registerUser from "./user/register.user";
import addCar from "./car/add.car";
import deleteCar from "./car/delete.car";
import editCar from "./car/edit.car";
import listCar from "./car/list.car";
import reservationList from "./reservation/list.reservation";
import reservationAdd from "./reservation/add.reservation";
import reservationDelete from "./reservation/delete.reservation";
import reservationEdit from "./reservation/edit.reservation";
import reservationInfo from "./reservation/info.reservation";
import userInfo from "./user/info.user";
import infoCar from "./car/info.car";

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
    infoCar,
    reservationAdd,
    reservationDelete,
    reservationEdit,
    reservationList,
    reservationInfo,
];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
