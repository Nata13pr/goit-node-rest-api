import express from "express";

import contactsControllers from '../controllers/contactsControllers.js'
import {schemas} from "../models/contact.js";
import {validateBody} from "../middlewares/index.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:contactId", contactsControllers.getOneContact);

contactsRouter.post("/", validateBody(schemas.createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:contactId", validateBody(schemas.createContactSchema), contactsControllers.updateContact);

contactsRouter.patch("/:contactId/favorite", validateBody(schemas.updateFavoriteSchema), contactsControllers.updateStatusContact)

contactsRouter.delete("/:contactId", contactsControllers.deleteContact);

export default contactsRouter;
