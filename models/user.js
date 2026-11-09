import {Schema, model} from "mongoose";
import Joi from "joi";
import {handleMongooseError} from "../helpers/index.js";

const subscriptionList = ['starter', 'pro', 'business'];

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
        enum: subscriptionList,
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
    }
}, {versionKey: false, timestamps: true})

userSchema.post('save', handleMongooseError);

const registerAndLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid(...subscriptionList).required().messages({
        "any.required": "missing field subscription",
    }),
});

export const schemas = {
    registerAndLoginSchema,
    updateSubscriptionSchema
}

export const User = model('user', userSchema);

