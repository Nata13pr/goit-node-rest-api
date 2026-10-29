import {Schema, model} from "mongoose";
import Joi from "joi";
import {handleMongooseError} from "../helpers/index.js";


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
}, {versionKey: false, timestamps: true})

userSchema.post('save', handleMongooseError);

const registerAndLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

export const schemas = {
    registerAndLoginSchema,
}

export const User = model('user', userSchema);

