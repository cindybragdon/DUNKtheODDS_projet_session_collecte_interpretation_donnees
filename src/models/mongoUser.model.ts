import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { regexEmail } from "../utils/regex";

// Create a Schema corresponding to the User interface.
const userSchema = new Schema<IUser>({

    username: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true 
    },
    email: { 
        type: String,
        required:true,
        unique:true,
        validate: {
            validator: (value: string) => regexEmail.test(value.toString()),
            message: 'The email needs to be an email.'
        }
    },
    role: { 
        type: String,
        required:true,
        enum: ["Admin", "User"]
    },
});

export const MongoUser = model<IUser>('User', userSchema);


export function validateMongoUser(user:IUser) {
    const userInstance = new MongoUser(user); //Create a user with the data 
    const validationError = userInstance.validateSync(); //Retrun null if the user is valid
    return !validationError? true : false
}
