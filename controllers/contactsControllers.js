import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {ctrlWrapper} from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
        const result = await contactsService.listContacts();
        res.status(200).json(result);
};

const getOneContact = async (req, res) => {
        const contact = await contactsService.getContactById(req.params.id)
        if (!contact) {
           throw HttpError(404, "Not found")
        }
        res.status(200).json(contact)
};

 const deleteContact = async (req, res) => {
        const contact = await contactsService.removeContact(req.params.id);
        if (!contact) {
            throw HttpError(404, "Not found")
        }
        res.status(200).json(contact)
};

 const createContact = async (req, res) => {
        const {name, email, phone} = req.body;
        const contact = await contactsService.addContact(name, email, phone);
        res.status(201).json(contact);
};

 const updateContact = async (req, res) => {
        const {id}=req.params;
        const contact = await contactsService.updateContact(id, req.body);
        if (!contact) {
            throw HttpError(404, "Not found")
        }
        res.status(200).json(contact);
};

 export default{
     getAllContacts:ctrlWrapper(getAllContacts),
     getOneContact:ctrlWrapper(getOneContact),
     deleteContact:ctrlWrapper(deleteContact),
     createContact:ctrlWrapper(createContact),
     updateContact:ctrlWrapper(updateContact),
 }
