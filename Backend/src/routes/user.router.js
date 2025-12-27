import { Router } from "express";
import { signupUser,loginUser,  changedPassword, logoutUser, userProfile } from "../controllers/auth.controller.js";
import { verifyjwt } from "../middleware/verifyJwt.middleware.js";

const router = Router()

router.route("/auth/signup").post(signupUser)
router.route("/auth/login").post(loginUser)
router.route("auth/logout").post(verifyjwt,logoutUser)
router.route("auth/me").post(verifyjwt,userProfile)
router.route("/auth/resetPassword").post(verifyjwt,changedPassword)


export default router