import {ctrlWrapper, HttpError} from "../helpers/index.js";
import {Contact} from "../models/contact.js";

const getAllContacts = async (req, res) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 20, favorite} = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {owner};

    if (favorite !== undefined) {
        filter.favorite = favorite === "true";
    }
    const result = await Contact.find(filter, "-createdAt -updatedAt", {
        skip,
        limit: limitNum
    }).populate('owner', "name");

    res.status(200).json(result);
};

const getOneContact = async (req, res) => {
    const {contactId} = req.params;
    const {_id: owner} = req.user;
    const contact = await Contact.findOne({_id: contactId, owner});
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json(contact)
};
const createContact = async (req, res) => {
        const {_id: owner} = req.user;
        const contact = await Contact.create({...req.body, owner});
        res.status(201).json(contact);
    }
;


const updateContact = async (req, res) => {
    const {contactId} = req.params;
    const {_id: owner} = req.user;
    const contact = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body, {
        returnDocument: 'after',
        runValidators: true
    });
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json(contact);
};

const updateStatusContact = async (req, res) => {
    const {contactId} = req.params;
    const {_id: owner} = req.user;
    const contact = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body, {
        returnDocument: 'after',
        runValidators: true
    })
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json(contact);
}

const deleteContact = async (req, res) => {
    const {contactId} = req.params;
    const {_id: owner} = req.user;
    const contact = await Contact.findOneAndDelete({_id: contactId, owner});
    if (!contact) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json({message: "contact deleted"});
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteContact: ctrlWrapper(deleteContact),
}
