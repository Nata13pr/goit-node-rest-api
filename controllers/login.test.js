/*
1. Given:
   - req object with body: { email, password }
   - res object with methods: status(code), json(data)
   - next function for error handling (ctrlWrapper)

2. If login credentials are valid:
   - response status code must be 200
   - response must return token with type String
   - response must return user object with 2 fields:
       * email: type String
       * subscription: type String

3. Test cases / Expected results:
   req.body = { email: testEmail, password: testPassword } =>
     res.statusCode === 200
     typeof res.data.token === 'string'
     typeof res.data.user === 'object'
     typeof res.data.user.email === 'string'
     typeof res.data.user.subscription === 'string'

   req.body = { email: testEmail, password: "wrongPassword" } =>
     next(error) called with status 401 and message 'Email or password is wrong'
*/

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import authControllers from "./usersControllers.js";
import { User } from "../models/user.js";

const { login } = authControllers;

describe("test login controller", () => {
    const testEmail = "test_autouser@mail.com";
    const testPassword = "superpassword123";

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_HOST);

        await User.deleteOne({ email: testEmail });

        const hashPassword = await bcrypt.hash(testPassword, 10);
        await User.create({
            email: testEmail,
            password: hashPassword,
            subscription: "starter",
        });
    });

    afterAll(async () => {
        await User.deleteOne({ email: testEmail });
        await mongoose.disconnect();
    });

    // ТЕСТ 1: Статус-код 200
    test("response should have status code 200", async () => {
        const req = {
            body: {
                email: testEmail,
                password: testPassword,
            },
        };

        const res = {
            statusCode: 200,
            data: null,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                this.data = data;
            },
        };

        const next = (err) => {
            if (err) console.error(err);
        };

        await login(req, res, next);

        expect(res.statusCode).toBe(200);
    });

    // ТЕСТ 2: Повертається токен (String)
    test("response should return token", async () => {
        const req = {
            body: {
                email: testEmail,
                password: testPassword,
            },
        };

        const res = {
            statusCode: 200,
            data: null,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                this.data = data;
            },
        };

        const next = (err) => {
            if (err) console.error(err);
        };

        await login(req, res, next);

        expect(res.data.token).toBeDefined();
        expect(typeof res.data.token).toBe("string");
    });

    // ТЕСТ 3: Повертається об'єкт user з полями email та subscription типу String
    test("response should return user object with email and subscription as String", async () => {
        const req = {
            body: {
                email: testEmail,
                password: testPassword,
            },
        };

        const res = {
            statusCode: 200,
            data: null,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                this.data = data;
            },
        };

        const next = (err) => {
            if (err) console.error(err);
        };

        await login(req, res, next);

        expect(res.data.user).toBeDefined();
        expect(typeof res.data.user).toBe("object");
        expect(typeof res.data.user.email).toBe("string");
        expect(typeof res.data.user.subscription).toBe("string");
    });

    // ТЕСТ 4: Невірні дані повертають помилку 401
    test("wrong credentials should pass 401 error to next()", async () => {
        const req = {
            body: {
                email: testEmail,
                password: "completelyWrongPassword",
            },
        };

        const res = {
            status() {
                return this;
            },
            json() {},
        };

        let caughtError = null;
        const next = (err) => {
            caughtError = err;
        };

        await login(req, res, next);

        expect(caughtError).not.toBeNull();
        expect(caughtError.status).toBe(401);
        expect(caughtError.message).toBe("Email or password is wrong");
    });
});