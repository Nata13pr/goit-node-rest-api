import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import {validateBody} from "../middlewares/index.js";
import {schemas} from "../models/user.js";
import {authenticate} from "../middlewares/authenticate.js";

const usersRouter = express.Router();

usersRouter.post('/register', validateBody(schemas.registerAndLoginSchema), usersControllers.register);

usersRouter.post('/login', validateBody(schemas.registerAndLoginSchema), usersControllers.login);

usersRouter.post('/logout', authenticate, usersControllers.logout)

usersRouter.get('/current', authenticate, usersControllers.getCurrent)

export default usersRouter;