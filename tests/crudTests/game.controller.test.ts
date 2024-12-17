import mongoose from "mongoose";
import { connectToMongoDatabase } from "../../src/data/databaseMongo"
import { config } from "../../src/config/config"
import { Response, Request} from "express";
import { MongoGamesController } from "../../src/controllers/game.controller";
import { MongoGames } from "../../src/models/mongoGame.model";

//https://basarat.gitbook.io/typescript/intro-1/jest
const mongoGamesController = new MongoGamesController();

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

    beforeEach(async () => {
        const testGame = new MongoGames({ homeTeamName: "Miggets" , homePoints: 217, awayTeamName: "Nuggers", awayPoints: 100, scheduled:"2024-10-23T02:00:00.000+00:00"});
        await testGame.save();
    });

    afterEach(async () => {
        await MongoGames.deleteMany({});
    });

    test('Should return a list of games', async () => {
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoGamesController.getAllGames(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Should return an error 404 if there is no games', async () => {
        await MongoGames.collection.drop();
        const req = mockRequest({},{}) as Request;
        const res = mockResponse() as Response;

        await mongoGamesController.getAllGames(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});