import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "please provide the email too"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "password is required please enter your password"]
    },
    fullName: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
    },
    CoverImage: {
        type: String,
    },
    refreshToken: {
        type: String
    }


}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)

})
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        password: this.password,
    },
        process.env.ACCESS_TOKEN_SECRET,
{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
})
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.ACCESS_REFRESH_SECRET,{
        expiresIn: process.env.ACCESS_REFRESH_EXPIRY
}
    )
}

export const User = mongoose.model("User", userSchema)