import { MongoTeamInfo } from '../models/mongoTeamInfo.model';

export class MongoTeamInfoService {

  public static async getAllTeamInfo() {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoTeamInfo.find();
  }
}