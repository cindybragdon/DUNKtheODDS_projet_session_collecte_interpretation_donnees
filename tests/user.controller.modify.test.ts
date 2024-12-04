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


    
describe('MODIFY PUT user', () => {

    let userId:mongoose.Types.ObjectId;
    let userId2:mongoose.Types.ObjectId;
    let userNotFoundId:mongoose.Types.ObjectId =  new mongoose.Types.ObjectId("6736b6716e8eb4c9228fe3b1");
    

    beforeAll(async () => {
        MongoUser.collection.drop();
        const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
        await testUser.save();
        const testUser2 = new MongoUser({ username:"Miniwheat", email:"miniwheat@gmail.com", password:"cestReal", role:"User"});
        await testUser2.save();
        userId = new mongoose.Types.ObjectId(testUser._id);
        userId2 =  new mongoose.Types.ObjectId(testUser2._id);
    });

    afterAll(async () => {
        MongoUser.collection.drop();
    });

    //CODE 200
    test('Should return a modified user', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username:"Gaytanguette", email:"gaytangue@gmail.com", role:"Admin"}));
    });

    //CODE 404
    test('Should return an error if the user is missing', async () => {
        const req = mockRequest({id:userNotFoundId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });
        
    test('Should return an error if the wanted email already exists', async () => {
        const req = mockRequest({id:userId2},{ username:"Miniwheat", email:"gaytangue@gmail.com", password:"cestReal", role:"User"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if the username is missing', async () => {
        const req = mockRequest({id:userId},{ email:"gaytangue@gmail.com", password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if the username is not a string', async () => {
        const req = mockRequest({id:userId},{ username:6, email:"gaytangue@gmail.com", password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if email field is missing', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if email field is not a correct email', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"HAMBURGER", password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if email field is not a string', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", email:6, password:"IamGaytangye", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if password field is missing', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if password field is not a string', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:6, role:"Admin"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

    test('Should return an error if the role is not "User" or "Admin"', async () => {
        const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:"IamGaytangye", role:"RAT"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Should return an error if the id is not a mongoose id', async () => {
        const req = mockRequest({id:"userId"},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:"IamGaytangye", role:"User"}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.modifyUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});



