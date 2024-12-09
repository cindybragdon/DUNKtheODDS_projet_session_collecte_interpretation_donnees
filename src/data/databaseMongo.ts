import { config } from '../config/config';
import mongoose from "mongoose"


let isConnected = false;


export const connectToMongoDatabase = async (database:string) => {
    if (isConnected) return;
    try {
        await mongoose.connect(database);
        isConnected = true;
        console.log(`Connected to the database ${config.nodeEnv} to URI ${database}`);
        
    } catch(error) {
        console.error("Cannot connect to Mongo DB : ", error)
    }
    
}
