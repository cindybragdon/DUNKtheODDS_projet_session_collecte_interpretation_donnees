import mongoose from "mongoose";
import { connectToMongoDatabase } from "../src/data/databaseMongo"
import { MongoPointsController } from "../src/controllers/points.controller"
import { config } from "../src/config/config"
import { Response, Request} from "express";
import { before } from "node:test";
import { MongoPoints } from "../src/models/mongoPoints.model";

//https://basarat.gitbook.io/typescript/intro-1/jest
const mongoPointsController = new MongoPointsController();



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


    
describe('GET ALL points', () => {

    beforeAll(async () => {
        MongoPoints.collection.drop();
        const testTeamScore = new MongoPoints({team1Name: "The - Balls", team2Name: "The inuits", team1Points: 5, team2Points: 6, pointsDifference: 6,numberOfPlayedGames: 5});
        await testTeamScore.save();
        const testTeamScore2 = new MongoPoints({team1Name: "The inuits", team2Name:"The big boats", team1Points: 3, team2Points: 8, pointsDifference: 8,numberOfPlayedGames: 3});
        await testTeamScore2.save();
        const testTeamScore3 = new MongoPoints({team1Name: "The big boats", team2Name:"The - Balls", team1Points: 6, team2Points: 2, pointsDifference: 2,numberOfPlayedGames: 6});
        await testTeamScore3.save();
    });

    afterAll(async () => {
        MongoPoints.collection.drop();
    });

    test('Should return a list of points', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoPointsController.getAllPoints(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({team1Name: "The - Balls", team2Name: "The inuits", team1Points: 5, team2Points: 6, pointsDifference: 6,numberOfPlayedGames: 5})
        ]));
    });

    before(async () => {
        MongoPoints.collection.drop();
    })

    test('Should return an error 404 if there is no points', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoPointsController.getAllPoints(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(expect.any(String));
    });

});



