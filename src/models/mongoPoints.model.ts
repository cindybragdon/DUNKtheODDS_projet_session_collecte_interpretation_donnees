import { model, Schema } from "mongoose";
import { IPoints } from "../interfaces/points.interface";
import { regexInt, regexPositiveInt } from "../utils/regex";

// Create a Schema corresponding to the IPoints interface.
const pointsSchema = new Schema<IPoints>({
    team1Name: { 
        type: String, 
        required: true 
    },
    team2Name: { 
        type: String,
        required: true
    },
    team1Points: { 
        type: Number,
        required:true, 
        validate: {
            validator: (value: number) => regexInt.test(value.toString()),
            message: 'The points needs to be a int number.'
        }
    },
    team2Points: { 
        type: Number, 
        required:true, 
        validate: {
            validator: (value: number) => regexInt.test(value.toString()),
            message: 'The price points to be a int number.'
        }
    },
    numberOfPlayedGames: {
        type: Number, 
        required: true,
        validate: {
            validator: (value: number) => regexPositiveInt.test(value.toString()),
            message: 'The number of home wins needs to be a positive int number.'
        }
    }
});


// Create a IPoints Mongoose Model.
export const MongoPoints = model<IPoints>('Points', pointsSchema);
  

export function validateMongoPoints(points:IPoints) {
    const pointsInstance = new MongoPoints(points); //Create a points with the data 
    const validationError = pointsInstance.validateSync(); //Return null if the points is valid
    return !validationError? true : false
}
