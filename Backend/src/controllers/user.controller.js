
import { User } from "../models/user.model.js";


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
const signupUser = async (req, res) => {
    try {
        const { username, password, email } = req.body

        if (!username || !password) {
            return res.status(401).json({
                message: "please provide both username and password"
            })
        }

        if ([email, username, password].some((fields) => fields?.trim() === "")) {
            return res.status(401).json({
                message: "username , password and message can not be empty can not be empty"
            })
        }

        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(401).json({
                    message: "email already exists"
                })
            }
            if (existingUser.username === username) {
                return res.status(401).json({
                    message: "username already exists"
                })
            }
        }

        const user = await User.create({ username, password, email })

        const createdUser = await User.findById(user._id)
            .select("-password")
            .lean()

        if (!createdUser) {
            return res.status(500).json({
                message: "there some error in creating your account"
            })
        }

        return res.status(201).json({
            message: "you are account has been created",
            createdUser
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(401).json({
                message: "!User is not found please provide the username and password"
            })
        }

        const user = await User.findOne({username})
        if (!user) {
            return res.status(401).json({
                message: "please create your account first through signing up"
            })
        }
        const passwordValidate = await user.isPasswordCorrect(password)

        if (!passwordValidate) {
            return res.status(401).json({
                message: "Password is incorrect !please try again"
            })
        }

        const { accessToken, refreshToken } = generateUserAccessAndRefreshToken(user._id)

        const loginUser = await User.findById(user._id)
            .select("-password -refreshToken")
            .lean()

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    message: "user logged in successfully",
                    user: loginUser, accessToken, refreshToken
                },
                
            )

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

export { signupUser,loginUser }