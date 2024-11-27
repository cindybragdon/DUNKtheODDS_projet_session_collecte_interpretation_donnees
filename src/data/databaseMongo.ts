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