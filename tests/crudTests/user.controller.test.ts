import mongoose from "mongoose";
import { connectToMongoDatabase } from "../../src/data/databaseMongo"
import { MongoUserController } from "../../src/controllers/user.controller"
import { config } from "../../src/config/config"
import { Response, Request} from "express";
import { MongoUser } from "../../src/models/mongoUser.model";
import { before } from "node:test";

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


describe('TESTS USER CONTROLLER', () => {
    describe('CREATE POST user', () => {

        beforeEach(async () => {
            const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
            await testUser.save();
        });
    
        afterEach(async () => {
            await MongoUser.deleteMany({});
        });
    
        test('Should work when creating a user with valid inputs', async () => {
            const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" }) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.signIn(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
        });
    
        test('Should return an error if the email of the created user already exists', async () => {
            const req = mockRequest({},{ username:"Stephane", email:"gaytang@gmail.com", password:"IamGaytang", role:"User" }) as Request;
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
    
        test('Should return an error if password field is missing', async () => {
            const req = mockRequest({},{ username:"Stephane", email:"steph@gmail.com", role:"User" }) as Request;
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
    
    
    describe('LOGIN POST user', () => {
    
        beforeEach(async () => {
            const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"$2a$10$WltNE9zXiYYHgGp/sCuwzObml8kv2weRed2NOvKJ6RxFVEonFc47W", role:"Admin"});
            await testUser.save()
            //await mongoUserController.signIn(req, res);
        });
    
        afterEach(async () => {
            await MongoUser.deleteMany({});
        });
    
    
        test('Should work when connecting with valid email and password', async () => {
            const req = mockRequest({},{ email:"gaytang@gmail.com", password:"gaytangDugrandPré"}) as Request;
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
    
    
        test('Should return an error if email field is missing', async () => {
            const req = mockRequest({},{password:"IamGaytang"}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.login(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if email field is not a correct email', async () => {
            const req = mockRequest({},{email:"HAMBURGER", password: "gaytangDugrandPré"}) as Request;
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
    
            expect(res.status).toHaveBeenCalledWith(401);
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
    
    describe('MODIFY PUT user', () => {
    
        let userId:mongoose.Types.ObjectId;
        let userId2:mongoose.Types.ObjectId;
        let userNotFoundId:mongoose.Types.ObjectId =  new mongoose.Types.ObjectId("6736b6716e8eb4c9228fe3b1");
        
    
        beforeEach(async () => {
            const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"$2a$10$WltNE9zXiYYHgGp/sCuwzObml8kv2weRed2NOvKJ6RxFVEonFc47W", role:"Admin"});
            await testUser.save();
            const testUser2 = new MongoUser({ username:"Miniwheat", email:"miniwheat@gmail.com", password:"cestReal", role:"User"});
            await testUser2.save();
            userId = new mongoose.Types.ObjectId(testUser._id);
            userId2 =  new mongoose.Types.ObjectId(testUser2._id);
        });
    
        afterEach(async () => {
            await MongoUser.deleteMany({});
        });
    
        //CODE 200
        test('Should return a modified user', async () => {
            const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:"IamGaytangye", role:"Admin"}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.modifyUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });
    
        //CODE 404
        test('Should return an error if the user is missing', async () => {
            await MongoUser.collection.drop();
            const req = mockRequest({id:userNotFoundId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", password:"IamGaytangye", role:"Admin"}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.modifyUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
            
        test('Should return an error if the wanted email already exists', async () => {
            const req = mockRequest({id:userId2},{ username:"Miniwheat", email:"gaytang@gmail.com", password:"cestReal", role:"User"}) as Request;
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
    
        test('Should return an error if password field is missing', async () => {
            const req = mockRequest({id:userId},{ username:"Gaytanguette", email:"gaytangue@gmail.com", role:"Admin"}) as Request;
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
    
    describe('DELETE user', () => {
    
    
        let userId:mongoose.Types.ObjectId;
        
    
        beforeEach(async () => {
            const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
            await testUser.save();
            userId = new mongoose.Types.ObjectId(testUser._id);
        });
    
        afterEach(async () => {
            await MongoUser.deleteMany({});
        });
    
        test('Should delete a user', async () => {
            const req = mockRequest({id:userId},{}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.deleteUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(204);
            //expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username:"Gaytanguette", email:"gaytangue@gmail.com", role:"Admin"}));
        });
    
        test('Should return an error if the user is missing', async () => {
            await MongoUser.collection.drop();
            const req = mockRequest({id:userId},{}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.deleteUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });
    
        test('Should return an error if the id is not a mongoose id', async () => {
            const req = mockRequest({id:"userId"},{}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.deleteUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('GET ALL USERINFO', () => {
    
        beforeEach(async () => {
            await MongoUser.collection.drop();
            const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
            await testUser.save();
            const testUser2 = new MongoUser({ username:"TEST", email:"test@gmail.com", password:"IamTest", role:"User"});
            await testUser2.save();
        });
    
        afterEach(async () => {
            await MongoUser.deleteMany({});
        });
    
        test('Should return a list of users', async () => {
            const req = mockRequest({},{}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.getAllUsers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });
    
        test('Should return an error 404 if there is no users', async () => {
            await MongoUser.collection.drop();
            const req = mockRequest({},{}) as Request;
            const res = mockResponse() as Response;
    
            await mongoUserController.getAllUsers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
})
