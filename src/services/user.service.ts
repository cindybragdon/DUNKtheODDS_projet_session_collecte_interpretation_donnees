import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { MongoUser } from '../models/mongoUser.model';

export class MongoUserService {

  public static async getAllUsers() {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoUser.find();
  }

  public static async getUserByEmail(email:string) {
    //https://mongoosejs.com/docs/api/model.html#Model.find()
    return await MongoUser.findOne({ email: email });
  }

  public static async createUser(data: IUser) {
    //https://mongoosejs.com/docs/api/model.html#Model.prototype.save()
    return await new MongoUser(data).save();
  }

  public static async modifyUser(id: mongoose.Types.ObjectId, data:IUser) {
    //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    return await MongoUser.findByIdAndUpdate(id, data, { new:true });
  }

  public static async deleteUser(id: mongoose.Types.ObjectId) {
    //https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
    return await MongoUser.findByIdAndDelete(id);
  }
}