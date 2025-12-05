import { Router } from "express";
import { signupUser,loginUser,  changedPassword } from "../controllers/user.controller.js";
import { verifyjwt } from "../middleware/verifyJwt.middleware.js";

const router = Router()

router.route("/auth/signup").post(signupUser)
router.route("/auth/login").post(loginUser)
router.route("/auth/resetPassword").post(verifyjwt,changedPassword)


export default router