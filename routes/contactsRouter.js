import express from "express";

import contactsControllers from '../controllers/contactsControllers.js'
import {schemas} from "../models/contact.js";
import {isValidId, validateBody} from "../middlewares/index.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:contactId", isValidId, contactsControllers.getOneContact);

contactsRouter.post("/", validateBody(schemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:contactId", isValidId, validateBody(schemas.updateContactSchema), contactsControllers.updateContact);

contactsRouter.patch("/:contactId/favorite", isValidId, validateBody(schemas.updateFavoriteSchema), contactsControllers.updateStatusContact)

contactsRouter.delete("/:contactId", isValidId, contactsControllers.deleteContact);

export default contactsRouter;
