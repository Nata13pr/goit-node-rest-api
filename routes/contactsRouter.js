import express from "express";

import contactsControllers from '../controllers/contactsControllers.js'
import {schemas} from "../models/contact.js";
import {isValidId, validateBody} from "../middlewares/index.js";
import {authenticate} from "../middlewares/authenticate.js";


const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, contactsControllers.getAllContacts);

contactsRouter.get("/:contactId", authenticate, isValidId, contactsControllers.getOneContact);

contactsRouter.post("/", authenticate, validateBody(schemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:contactId", authenticate, isValidId, validateBody(schemas.updateContactSchema), contactsControllers.updateContact);

contactsRouter.patch("/:contactId/favorite", authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), contactsControllers.updateStatusContact)

contactsRouter.delete("/:contactId", authenticate, isValidId, contactsControllers.deleteContact);

export default contactsRouter;
