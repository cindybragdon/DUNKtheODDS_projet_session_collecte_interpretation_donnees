import { model, Schema } from "mongoose";
import { IPoints } from "../interfaces/points.interface";
import { regexInt, regexPositiveInt } from "../utils/regex";
import { IGame } from "../interfaces/game.interface";

// Create a Schema corresponding to the IPoints interface.
const gameSchema = new Schema<IGame>({
    homeTeamName: { 
        type: String, 
        required: true 
    },
    homePoints: { 
        type: Number,
        required:true, 
        validate: {
            validator: (value: number) => regexInt.test(value.toString()),
            message: 'The home points needs to be a int number.'
        }
    },
    awayTeamName: { 
        type: String,
        required: true
    },
    awayPoints: { 
        type: Number, 
        required:true, 
        validate: {
            validator: (value: number) => regexInt.test(value.toString()),
            message: 'The away points needs to be a int number.'
        }
    },
    scheduled: {
        type: Date,
        required:true
    }
});


// Create a IPoints Mongoose Model.
export const MongoGames = model<IGame>('Games', gameSchema);

export function validateMongoGames(game:IGame) {
    const gameInstance = new MongoGames(game); //Create a game with the data 
    const validationError = gameInstance.validateSync(); //Return null if the game is valid
    return !validationError? true : false
}
