import {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateById,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const result = await listContacts();
    res.status(200).json(result);
};

export const getOneContact = async (req, res) => {
    const contact = await getContactById(req.params.id)
    if (contact) {
        res.status(200).json(contact);
    } else {
        res.status(404).json({"message": "Not found"})
    }
};

export const deleteContact = async (req, res) => {
    const contact = await removeContact(req.params.id)
    if (contact) {
        res.status(200).json(contact)
    } else {
        res.status(404).json({"message": "Not found"})
    }
};

export const createContact = async (req, res) => {
    const {name, email, phone} = req.body;
    const contact = await addContact(name, email, phone);
    res.status(201).json(contact);

};

export const updateContact = async (req, res) => {
    if(Object.keys(req.body).length === 0){
        res.status(400).json({"message": "Body must have at least one field"})
    }
    const contact=await updateB
    if(!contact){
        res.status(404).json({"message": "Not found"})
    }
};
