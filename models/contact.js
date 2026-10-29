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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
}, {versionKey: false, timestamps: true})

contactSchema.post('save', handleMongooseError);

const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    favorite: Joi.boolean(),
    phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
})

const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
    favorite: Joi.boolean(),
})
    .min(1)
    .messages({
        "object.min": "missing fields",
    });

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        "any.required": "missing field favorite",
    }),
});

export const schemas = {
    createContactSchema,
    updateContactSchema,
    updateFavoriteSchema,
}

export const Contact = model('contact', contactSchema)
