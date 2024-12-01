import { config } from '../config/config';
import mongoose from "mongoose"

export const connectToMongoDatabase = async (database:string) => {

    try {
        await mongoose.connect(database);
        console.log(`Connected to the database ${config.nodeEnv} to URI ${database}`);
    } catch(error) {
        console.error("Cannot connect to Mongo DB : ", error)
    }
    
}
