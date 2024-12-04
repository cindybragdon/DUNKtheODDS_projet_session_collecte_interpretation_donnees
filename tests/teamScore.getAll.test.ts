import mongoose from "mongoose";
import { connectToMongoDatabase } from "../src/data/databaseMongo"
import { MongoTeamScoreController } from "../src/controllers/teamScore.controller"
import { config } from "../src/config/config"
import { Response, Request} from "express";
import { MongoTeamScore } from "../src/models/mongoTeamScore.model";
import { before } from "node:test";

//https://basarat.gitbook.io/typescript/intro-1/jest
const mongoTeamScoreController = new MongoTeamScoreController();



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


    
describe('GET ALL teamScore', () => {

    beforeAll(async () => {
        MongoTeamScore.collection.drop();
        const testTeamScore = new MongoTeamScore({teamName: "The - Balls", homeWins: 5, homeLosts: 6, awayWins: 6,awayLosts: 5});
        await testTeamScore.save();
        const testTeamScore2 = new MongoTeamScore({teamName: "The inuits", homeWins: 3, homeLosts: 8, awayWins: 8,awayLosts: 3});
        await testTeamScore2.save();
        const testTeamScore3 = new MongoTeamScore({teamName: "The big boats", homeWins: 6, homeLosts: 2, awayWins: 2,awayLosts: 6});
        await testTeamScore3.save();
    });

    afterAll(async () => {
        MongoTeamScore.collection.drop();
    });

    test('Should return a list of teamScores', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoTeamScoreController.getAllTeamScores(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({teamName: "The - Balls", homeWins: 5, homeLosts: 6, awayWins: 6,awayLosts: 5})
        ]));
    });

    before(async () => {
        MongoTeamScore.collection.drop();
    })

    test('Should return an error 404 if there is no teams scores', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoTeamScoreController.getAllTeamScores(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

});



