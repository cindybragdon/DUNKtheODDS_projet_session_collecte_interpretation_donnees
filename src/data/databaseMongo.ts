import { config } from '../config/config';
import mongoose, { model, Schema } from "mongoose"
import { IPoints } from '../interfaces/points.interface';
import { regexInt, regexPositiveInt } from '../utils/regex';
import { ITeamScore } from '../interfaces/teamScore.interface';
//import { regexEmail, regexName, regexPrice, regexQuantity } from './regex';



//https://mongoosejs.com/docs/validation.html

// Create a Schema corresponding to the Product interface.
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
  

// Create a Schema corresponding to the User interface.
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

// Create a Product Model.
export const MongoPoints = model<IPoints>('Points', pointsSchema);

// Create a User Model.
export const MongoTeamScore = model<ITeamScore>('TeamScores', teamScoreSchema);

export const connectToMongoDatabase = async (database:string) => {

    try {
        await mongoose.connect(database);
        console.log(`Connected to the database ${config.nodeEnv} to URI ${database}`);
    } catch(error) {
        console.error("Cannot connect to Mongo DB : ", error)
    }
    
}


export function validateMongoPoints(points:IPoints) {
    const pointsInstance = new MongoPoints(points); //Create a points with the data 
    const validationError = pointsInstance.validateSync(); //Return null if the points is valid
    return !validationError? true : false
}

export function validateMongoTeamScore(teamScore:ITeamScore) {
    const teamScoreInstance = new MongoTeamScore(teamScore); //Create a teamscore with the data 
    const validationError = teamScoreInstance.validateSync(); //Return null if the teamscore is valid
    return !validationError? true : false
}
/*
export function populateMongoDatabase() {

    MongoProduct.collection.drop()
    MongoUser.collection.drop()

    
    const jsonProductArray: IProduct[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseProducts)));
    jsonProductArray.filter(product => {
        if(validateMongoProduct(product)) new MongoProduct(product).save()
    });
    console.log("Mongo table products filled ")

    const jsonUserArray: IUser[] = Array.from(JSON.parse(getDataFromFile(config.pathDatabaseUsers)));
    jsonUserArray.filter(user => {
        if(validateMongoUser(user)) new MongoUser(user).save()
    });
    console.log("Mongo table users filled ")
    
} 
    */