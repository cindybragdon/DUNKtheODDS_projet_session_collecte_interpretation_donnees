import mongoose from "mongoose";
import { connectToMongoDatabase } from "../../src/data/databaseMongo"
import { MongoUserController } from "../../src/controllers/user.controller"
import { config } from "../../src/config/config"
import { Response, Request} from "express";
import { MongoUser } from "../../src/models/mongoUser.model";

//https://basarat.gitbook.io/typescript/intro-1/jest
const mongoUserController = new MongoUserController();

//Create false response 
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

//Create false request
const mockRequest = (params:any, data:any):Partial<Request> => ({ params:params, body: data });

//Connect to mongo Database before all
beforeAll(async () => {
    await connectToMongoDatabase(config.DB_TEST_URI_FINAL);
});

//After all tests, disconnect from database
afterAll(async () => {
    await mongoose.disconnect();

});


describe('LOGIN POST user', () => {

    beforeAll(async () => {
        MongoUser.collection.drop();
        const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
        await testUser.save();
    });

    afterAll(async () => {
        MongoUser.collection.drop();
    });


    test('Should work when connecting with valid email and password', async () => {
        const req = mockRequest({},{ email:"gaytang@gmail.com", password:"IamGaytang"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Should return an error if password field is missing', async () => {
        const req = mockRequest({},{email:"gaytang@gmail.com"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if password field is not a string', async () => {
        const req = mockRequest({},{email:"gaytang@gmail.com",password:5}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if email field is missing', async () => {
        const req = mockRequest({},{password:"IamGaytang"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if email field is not a correct email', async () => {
        const req = mockRequest({},{email:"HAMBURGER", password: "IamGaytang"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if email field is not a string', async () => {
        const req = mockRequest({},{email:6, password: "IamGaytang"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if password and email are not present', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if password and email are undefined', async () => {
        const req = mockRequest({},{email:undefined, password: undefined}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });


    test('Should return an error if the user does not exists ', async () => {
        const req = mockRequest({},{email:"stephane@gmail.com", password: "IDontHaveAnAccount"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });


    test('Should return an error if the email is correct but not the password ', async () => {
        const req = mockRequest({},{email:"gaytang@gmail.com",password:"notCorrectPassword"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });
});