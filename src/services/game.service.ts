import { MongoGames } from "../models/mongoGame.model";

export class MongoGameService {

  public static async getAllGames() {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoGames.find();
  }
}