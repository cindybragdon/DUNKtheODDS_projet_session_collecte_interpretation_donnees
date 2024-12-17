import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import { MongoPointsService } from '../services/points.service';
import { MongoGameService } from '../services/game.service';

//https://mongoosejs.com/docs/api/model.html#Model.find()
//https://mongoosejs.com/docs/api/model.html#Model.findById()

export class MongoGamesController {

  public async getAllGames(req: Request, res: Response): Promise<void> {

    try {
        const games = await MongoGameService.getAllGames();

        if(!games || games.length === 0) {
          logger.error(`STATUS 404 : ${req.method} ${req.url}`);
          console.log("STATUS 404: GAMES NOT FOUND");
          res.status(404).json([]);
          return;
        }
        logger.info(`STATUS 200: ${req.method} ${req.url}`);
        console.log("STATUS 200: GETALLGAMES WORKED");
        res.status(200).json(games);
  
    } catch(error){
        logger.error(`STATUS 500: ${req.method} ${req.url}`);
        console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
        res.status(500).send("INTERNAL ERROR");
    }
  }
}