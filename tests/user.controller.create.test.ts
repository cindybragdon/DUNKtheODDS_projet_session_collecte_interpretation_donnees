import mongoose from "mongoose";
import { connectToMongoDatabase } from "../src/data/databaseMongo"
import { MongoUserController } from "../src/controllers/user.controller"
import { config } from "../src/config/config"
import { Response, Request} from "express";
import { MongoUser } from "../src/models/mongoUser.model";

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



describe('CREATE POST user', () => {

    beforeAll(async () => {
        MongoUser.collection.drop();
        const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
        await testUser.save();
    });

    afterAll(async () => {
        MongoUser.collection.drop();
    });

    test('Should work when creating a user with valid inputs', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Should return an error if the email of the created user already exists', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if the username is missing', async () => {
        const req = mockRequest({},{email:"steph@gmail.com", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if the username is not a string', async () => {
        const req = mockRequest({},{ username:6, email:"steph@gmail.com", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    test('Should return an error if the email of the created user already exists', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });



    test('Should return an error if password field is missing', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if password field is not a string', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", password:6, role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });


    
    test('Should return an error if email field is missing', async () => {
        const req = mockRequest({},{ username:"Stephane", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    test('Should return an error if email field is not a correct email', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"HAMBURGER", password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    test('Should return an error if email field is not a string', async () => {
        const req = mockRequest({},{ username:"Stephane", email:6, password:"IAmStephane", role:"User" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    test('Should return an error if the role is not "User" or "Admin"', async () => {
        const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"RAT" }) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });



    test('Should return an error if password and email are not present', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });
});
