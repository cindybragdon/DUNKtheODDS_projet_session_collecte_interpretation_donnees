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


    
describe('DELETE user', () => {


    let userId:mongoose.Types.ObjectId;
    

    beforeAll(async () => {
        MongoUser.collection.drop();
        const testUser = new MongoUser({ username:"Gaytang", email:"gaytang@gmail.com", password:"IamGaytang", role:"Admin"});
        await testUser.save();
        userId = new mongoose.Types.ObjectId(testUser._id);
    });

    afterAll(async () => {
        MongoUser.collection.drop();
    });

    test('Should delete a user', async () => {
        const req = mockRequest({id:userId},{}) as Request;
        const res = mockResponse() as Response;

        await mongoUserController.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        //expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username:"Gaytanguette", email:"gaytangue@gmail.com", role:"Admin"}));
    });

    test('Should return an error if the user is missing', async () => {
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