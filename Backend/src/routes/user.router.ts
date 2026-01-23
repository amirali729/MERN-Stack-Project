import { Router } from "express";
import { signupUser,loginUser,  changedPassword, logoutUser, userProfile } from "../controllers/auth.controller.js";
import { verifyjwt } from "../middleware/verifyJwt.middleware.js";
import { logoutAll, refreshAccessToken } from "../controllers/token.controller.js";

const router = Router()

router.route("/auth/signup").post(signupUser)
router.route("/auth/login").post(loginUser)
router.route("/auth/logout").post(verifyjwt,logoutUser)
router.route("/auth/me").get(verifyjwt,userProfile)
router.route("/auth/resetPassword").post(verifyjwt,changedPassword)
router.route("/auth/refresh").post(verifyjwt,refreshAccessToken)
router.route("/auth/logoutAll").post(verifyjwt,logoutAll)


export default router