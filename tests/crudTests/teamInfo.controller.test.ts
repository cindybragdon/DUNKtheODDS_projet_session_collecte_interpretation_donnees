import mongoose from "mongoose";
import { connectToMongoDatabase } from "../../src/data/databaseMongo"
import { MongoTeamInfoController } from "../../src/controllers/teamInfo.controller"
import { config } from "../../src/config/config"
import { Response, Request} from "express";
import { MongoTeamInfo } from "../../src/models/mongoTeamInfo.model";
import { before } from "node:test";

//https://basarat.gitbook.io/typescript/intro-1/jest
const mongoTeamInfoController = new MongoTeamInfoController();



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


    
describe('GET ALL teamInfo', () => {

    beforeEach(async () => {
        await MongoTeamInfo.collection.drop();
        const testTeamInfo = new MongoTeamInfo({teamName: "The - Balls", homeWins: 5, homeLosts: 6, awayWins: 6,awayLosts: 5});
        await testTeamInfo.save();
        const testTeamInfo2 = new MongoTeamInfo({teamName: "The inuits", homeWins: 3, homeLosts: 8, awayWins: 8,awayLosts: 3});
        await testTeamInfo2.save();
        const testTeamInfo3 = new MongoTeamInfo({teamName: "The big boats", homeWins: 6, homeLosts: 2, awayWins: 2,awayLosts: 6});
        await testTeamInfo3.save();
    });

    afterEach(async () => {
        await MongoTeamInfo.deleteMany({});
    });

    test('Should return a list of teamInfo', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoTeamInfoController.getAllTeamInfo(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({teamName: "The - Balls", homeWins: 5, homeLosts: 6, awayWins: 6,awayLosts: 5})
        ]));
    });


    test('Should return an error 404 if there is no teams scores', async () => {
        await MongoTeamInfo.collection.drop();
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoTeamInfoController.getAllTeamInfo(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

});