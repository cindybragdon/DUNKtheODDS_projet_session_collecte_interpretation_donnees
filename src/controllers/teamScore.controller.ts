
import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import { MongoTeamScoreService } from '../services/teamScore.service';

//https://mongoosejs.com/docs/api/model.html#Model.find()
//https://mongoosejs.com/docs/api/model.html#Model.findById()

export class MongoTeamScoreController {

  public async getAllTeamScores(req: Request, res: Response): Promise<void> {

    try {
        const teamScores = await MongoTeamScoreService.getAllTeamScore();

        if(!teamScores) {
            logger.error(`STATUS 404 : ${req.method} ${req.url}`);
            console.log("STATUS 404: TEAM SCORES NOT FOUND");
            res.status(404).send("TEAM SCORES NOT FOUND");
            return;
        }
        logger.info(`STATUS 200: ${req.method} ${req.url}`);
        console.log("STATUS 200: GETALLTEAMSCORES WORKED");
        res.status(200).json(teamScores);
  
    } catch(error){
        logger.error(`STATUS 500: ${req.method} ${req.url}`);
        console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
        res.status(500).send("INTERNAL ERROR");
    }
  }
}