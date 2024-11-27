import { MongoTeamScore } from '../models/mongoTeamScore.model';

export class MongoTeamScoreService {

  public static async getAllTeamScore() {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoTeamScore.find();
  }
}