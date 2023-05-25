import express from "express";
import { getStatus } from "./status/get.status";
import { register } from "./status/post.register";
import { login } from "./status/post.login";
import { rentCar } from "./status/post.rentCar";

const router = express.Router();
// middleware
router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});
// home page route
router.get("/", (req, res) => {
    res.send("Example home page");
});
// api route
router.get("/api/status", getStatus);
router.post("/api/register", register);
router.post("/api/login", login);
router.post("/api/rent", rentCar);
export default router;
