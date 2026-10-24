import {Schema, model} from "mongoose";
import Joi from "joi";

import {handleMongooseError} from "../helpers/index.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
})

contactSchema.post('save', handleMongooseError);

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    favorite: Joi.boolean(),
    phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
})

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});
export const schemas = {
    createContactSchema,
    updateFavoriteSchema
}

export const Contact = model('contact', contactSchema)
