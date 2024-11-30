import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import { MongoPointsService } from '../services/points.service';

//https://mongoosejs.com/docs/api/model.html#Model.find()
//https://mongoosejs.com/docs/api/model.html#Model.findById()

export class MongoPointsController {

  public async getAllPoints(req: Request, res: Response): Promise<void> {

    try {
        const points = await MongoPointsService.getAllPoints();

        if(!points) {
          logger.error(`STATUS 404 : ${req.method} ${req.url}`);
          console.log("STATUS 404: POINTS NOT FOUND");
          res.status(404).send("POINTS NOT FOUND");
          return;
        }
        logger.info(`STATUS 200: ${req.method} ${req.url}`);
        console.log("STATUS 200: GETALLPOINTS WORKED");
        res.status(200).json(points);
  
    } catch(error){
        logger.error(`STATUS 500: ${req.method} ${req.url}`);
        console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
        res.status(500).send("INTERNAL ERROR");
    }
  }
}