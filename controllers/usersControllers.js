import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import path from 'path';
import {Jimp} from "jimp"
import fs from 'fs/promises';

import {HttpError, ctrlWrapper} from "../helpers/index.js";

import {User} from "../models/user.js";

const {SECRET_KEY} = process.env;

const avatarsDir = path.resolve("public", "avatars");

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})

    if (user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email)

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription
        }
    })
}

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '24h'});
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    })
}

const logout = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ''});

    res.status(204).json();
}

const getCurrent = async (req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription
    })
}

const updateUserSubscription = async (req, res) => {
    const {_id} = req.user;
    const user = await User.findByIdAndUpdate(_id, req.body, {returnDocument: 'after', runValidators: true})
    if (!user) {
        throw HttpError(404, "Not found")
    }
    res.status(200).json({
        email: user.email,
        subscription: user.subscription,
    });
};


const updateAvatar = async (req, res) => {
    if (!req.file) {
        throw HttpError(400, "Avatar file is required");
    }
    const {_id} = req.user;
    const {path: tmpUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    try {
        const image = await Jimp.read(tmpUpload)
        image.resize({w: 250, h: 250});
        await image.write(resultUpload)
        await fs.unlink(tmpUpload);
        const avatarURL = `/avatars/${filename}`
        await User.findByIdAndUpdate(_id, {avatarURL})

        res.status(200).json({
            avatarURL
        })
    } catch (error) {
        await fs.unlink(tmpUpload).catch(() => {
        });
        throw error;
    }
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateUserSubscription: ctrlWrapper(updateUserSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}