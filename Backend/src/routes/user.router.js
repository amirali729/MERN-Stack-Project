import { Router } from "express";
import { signupUser,loginUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/auth/signup").post(signupUser)
router.route("/auth/login").post(loginUser)


export default router