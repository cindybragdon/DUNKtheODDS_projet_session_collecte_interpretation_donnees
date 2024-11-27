import { model, Schema } from "mongoose";
import { ITeamScore } from "../interfaces/teamScore.interface";
import { regexPositiveInt } from "../utils/regex";

// Create a Schema corresponding to the ITeamScore interface.
const teamScoreSchema = new Schema<ITeamScore>({

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


// Create a ITeamScore Mongoose Model.
export const MongoTeamScore = model<ITeamScore>('TeamScores', teamScoreSchema);

export function validateMongoTeamScore(teamScore:ITeamScore) {
    const teamScoreInstance = new MongoTeamScore(teamScore); //Create a teamscore with the data 
    const validationError = teamScoreInstance.validateSync(); //Return null if the teamscore is valid
    return !validationError? true : false
}