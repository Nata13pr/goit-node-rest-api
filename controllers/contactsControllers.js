import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res,next) => {
    try {
        const result = await contactsService.listContacts();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }

};

export const getOneContact = async (req, res,next) => {
    try {
        const contact = await contactsService.getContactById(req.params.id)
        if (!contact) {
           return next( HttpError(404, "Not found"))
        }
        res.status(200).json(contact)
    } catch (error) {
        next(error)
    }

};

export const deleteContact = async (req, res,next) => {
    try {
        const contact = await contactsService.removeContact(req.params.id);
        if (!contact) {
           return next( HttpError(404, "Not found"))
        }
        res.status(200).json(contact)
    } catch (error) {
   next(error);
    }
};

export const createContact = async (req, res,next) => {
    try {
        const {name, email, phone} = req.body;
        const contact = await contactsService.addContact(name, email, phone);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res,next) => {
    try {
        const contact = await contactsService.updateContact(req.params.id, req.body);
        if (!contact) {
            return next( HttpError(404, "Not found"))
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};
