import crypto from "crypto"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"


const OTP_EXPIRATION = 2 * 60

const generateOTP = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
    return otp
}

const sendOTP = async (email: string, name: string) => {
    const otp = generateOTP();
    const redisKey = `otp:${email}`
    const user = await User.findOne({email})
    if(!user){
        throw new AppError(404,"User not found")
    }
    if(user.isVarified){
        throw new AppError(401, "You are already verified")
    }
    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP code varification",
        templateName: "otp",
        templateData: {
            name: name,
            email: email,
            otp
        }
    })


}
const verifyOTP = async (email: string, otp: string) => {
    const redisKey = `otp:${email}`
    const saveOtp = await redisClient.get(redisKey)
    if (!saveOtp) {
        throw new AppError(401, "Invalid OTP")
    }

    if (saveOtp !== otp) {
        throw new AppError(401, "Invalid OTP")
    }
    await Promise.all([
        await User.updateOne({ email }, { isVarified: true }, { runValidators: true }),
        await redisClient.del([redisKey])
    ])
}

export const OTPServices = {
    sendOTP,
    verifyOTP
}