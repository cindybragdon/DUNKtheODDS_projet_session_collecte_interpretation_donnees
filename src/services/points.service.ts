import { MongoPoints } from '../models/mongoPoints.model';

export class MongoPointsService {

  public static async getAllPoints() {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoPoints.find();
  }
}