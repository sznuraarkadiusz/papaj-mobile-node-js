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
import getCarInfo from "./car/info.car";
import editUser from "./user/edit.user";
import displayCurrency from "./currency/display.currency";
import addRent from "./rent/add.rent";
import editRent from "./rent/edit.rent";
import infoRent from "./rent/info.rent";
import listRent from "./rent/list.rent";

const router = express.Router();

const apiRoutes = [
    getStatus,
    userInfo,
    loginUser,
    editUser,
    registerUser,
    addCar,
    deleteCar,
    editCar,
    listCar,
    getCarInfo,
    reservationAdd,
    reservationDelete,
    reservationEdit,
    reservationList,
    reservationInfo,
    displayCurrency,
    addRent,
    editRent,
    deleteCar,
    infoRent,
    listRent,

];

apiRoutes.forEach((route) =>
    router[route.method](route.path, route.validators, route.handler),
);

export default router;
