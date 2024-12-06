import { model, Schema } from "mongoose";
import { ITeamInfo } from "../interfaces/teamInfo.interface";
import { regexPositiveInt } from "../utils/regex";

// Create a Schema corresponding to the ITeamInfo interface.
const teamInfoSchema = new Schema<ITeamInfo>({

  teamName: { 
      type: String, 
      required: true
  },
  homeWins: { 
      type: Number, 
      required: true,
      validate: {
          validator: (value: number) => regexPositiveInt.test(value.toString()),
          message: 'The number of home wins needs to be a positive int number.'
      }
  },
  homeLosts: { 
      type: Number, 
      required: true,
      validate: {
          validator: (value: number) => regexPositiveInt.test(value.toString()),
          message: 'The number of home losts needs to be a positive int number.'
      }
  },
  awayWins: { 
      type: Number, 
      required: true,
      validate: {
          validator: (value: number) => regexPositiveInt.test(value.toString()),
          message: 'The number of away wins needs to be a positive int number.'
      }
  },
  awayLosts: { 
      type: Number, 
      required: true,
      validate: {
          validator: (value: number) => regexPositiveInt.test(value.toString()),
          message: 'The number of away losts needs to be a positive int number.'
      }
  },
});


// Create a ITeamInfo Mongoose Model.
export const MongoTeamInfo = model<ITeamInfo>('TeamInfo', teamInfoSchema);

export function validateMongoTeamInfo(teamInfo:ITeamInfo) {
    const teamInfoInstance = new MongoTeamInfo(teamInfo); //Create a ITeamInfo with the data 
    const validationError = teamInfoInstance.validateSync(); //Return null if the ITeamInfo is valid
    return !validationError? true : false
}