import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

const logoutAll = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.tokenVersion += 1;
    await user.save();
    return res.status(200).json({ message: "Logged out from all devices" });
};
const generateUserAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        return { accessToken, refreshToken }
    }
    catch (error) {
        console.log("there some error in ",error)
    }
}

const refreshAccessToken = async (req,res) => {
    try {
        const incomingtoken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingtoken) {
            return res.status(401).json({
                message: "invalid authorization"
            })
        }

        const decodedToken = jwt.verify(incomingtoken,process.env.ACCESS_REFRESH_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
        return res.status(401).json({
            message: "invalid token"
        })
    }

    if (incomingToken !== user?.refreshToken) {
        return res.status(401).json({
            message: "Refresh token is expired or used"
        })
    }
    const {accessToken,refreshToken} = await generateUserAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(501).json({
                message: error.message
            })
        }
    }
}
export { generateUserAccessAndRefreshToken,logoutAll,refreshAccessToken}