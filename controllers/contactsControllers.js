import {Contact} from "../models/contact.js";
import {ctrlWrapper, HttpError} from "../helpers/index.js";

const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.status(200).json(result);
};

const getOneContact = async (req, res) => {
    const {contactId} = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json(contact)
};
const createContact = async (req, res) => {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
};


const updateContact = async (req, res) => {
    const {contactId} = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true,runValidators: true});
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json(contact);
};

const updateStatusContact = async (req, res) => {
    const {contactId} = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true,runValidators: true})
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json(contact);
}

const deleteContact = async (req, res) => {
    const {contactId} = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json({ message: "contact deleted" });
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteContact: ctrlWrapper(deleteContact),
}
