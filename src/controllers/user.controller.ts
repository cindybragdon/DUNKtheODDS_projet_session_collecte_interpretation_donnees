import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import mongoose from 'mongoose';
import { MongoUser, validateMongoUser } from '../models/mongoUser.model';
import { MongoUserService } from '../services/user.service';
import { config } from '../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { regexEmail } from '../utils/regex';

//https://mongoosejs.com/docs/api/model.html#Model.find()
//https://mongoosejs.com/docs/api/model.html#Model.findById()

export class MongoUserController {

    public async getAllUsers(req: Request, res: Response): Promise<void> {

    try {
        const users = await MongoUserService.getAllUsers();

        if(!users || users.length === 0) {
            logger.error(`STATUS 404 : ${req.method} ${req.url}`);
            console.log("STATUS 404: USERS NOT FOUND");
            res.status(404).json([]);
            return;
        }
        logger.info(`STATUS 200: ${req.method} ${req.url}`);
        console.log("STATUS 200: GETALLUSERS WORKED");
        res.status(200).json(users);
    
    } catch(error){
        logger.error(`STATUS 500: ${req.method} ${req.url}`);
        console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
        res.status(500).send("INTERNAL ERROR");
    }
    }


    public async login(req: Request, res: Response): Promise<void> {
        try {

            const email = req.body.email;
            const password = req.body.password;

            if(!regexEmail.test(email) || !password || typeof password !== 'string'){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: USER CAN'T LOG");
                res.status(400).send("STATUS 400 : ERROR WITH YOUR REQUEST");
                return;
            }

            const user = await MongoUserService.getUserByEmail(email);
                
            if (!user) {
    
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: INCORRECT PASSWORD OR EMAIL");
                res.status(401).send('INCORRECT PASSWORD OR EMAIL' );
                return;
            }
 
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: INCORRECT PASSWORD OR EMAIL");
                res.status(401).send('INCORRECT PASSWORD OR EMAIL');
                return;
            }

            const token = jwt.sign({ user }, config.jwtSecret, { expiresIn: '1h' });
            
            logger.info(`STATUS 200: ${req.method} ${req.url}`);
            console.log("STATUS 200: WELCOME");
            res.status(200).json({token:token, user:user});
            

        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).send("INTERNAL ERROR");
        }
    }

    public async signIn(req: Request, res: Response): Promise<void> {

        try{
            const password = req.body.password;
    
            if(!validateMongoUser(req.body)){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER NOT ADDED");
                res.status(400).send("STATUS 400 : ERROR WITH YOUR REQUEST");
                return;
            }

            const userToSignIn = await MongoUser.findOne({ email: req.body.email });
            if(userToSignIn){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER NOT ADDED");
                res.status(400).send("STATUS 400 : EMAIL ALREADY EXIST. PLEASE CONNECT INSTEAD");
                return;
            }

            const newUser = new MongoUser(req.body);
            newUser.password = await bcrypt.hash(password, 10);
    
            const response = await MongoUserService.createUser(newUser);
    
            logger.info(`STATUS 201: ${req.method} ${req.url}`);
            console.log("STATUS 201: NEW USER ADDED");
            res.status(201).json(response);

        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).send("INTERNAL ERROR");
        }
    };


    public async modifyUser(req: Request, res: Response): Promise<void> {


        try{


            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER WASN'T MODIFIED");
                res.status(400).send("ERROR WITH YOUR REQUEST ID");
                return;
            } 

            const userId = new mongoose.Types.ObjectId(req.params.id);

            if(!validateMongoUser(req.body)){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER WASN'T MODIFIED");
                res.status(400).send("ERROR WITH YOUR REQUEST");
                return;
            } 
        
            const userToModify = await MongoUser.findById( userId ).exec();
            if(!userToModify) {
                logger.error(`STATUS 404 : ${req.method} ${req.url}`);
                console.log("STATUS 404: USER NOT FOUND");
                res.status(404).send("USER NOT FOUND");
                return;
            }

            const userEmailAlreadyExist = await MongoUser.findOne({ email: req.body.email });
            
            if(userEmailAlreadyExist) {
                if(String(userEmailAlreadyExist._id) !== String(userId)) {
                    logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                    console.log("STATUS 400: USER NOT MODIFIED");
                    res.status(400).send("STATUS 400 : EMAIL ALREADY EXIST");
                    return;
                }
            }

            req.body.password = await bcrypt.hash(req.body.password, 10);

            const response = await MongoUserService.modifyUser(userId, req.body);
        
            logger.info(`STATUS 200: ${req.method} ${req.url}`);
            console.log(`STATUS 200: USER WITH ID ${userId} MODIFIED`);
            res.status(200).json(response);

        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).send("INTERNAL ERROR");
        }
        
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {

        try {


            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER WASN'T MODIFIED");
                res.status(400).send("ERROR WITH YOUR REQUEST ID");
                return;
            } 

            const userId = new mongoose.Types.ObjectId(req.params.id);   
            const userToDelete = await MongoUser.findById( userId ).exec();


            if(!userToDelete) {
        
                logger.error(`STATUS 404 : ${req.method} ${req.url}`);
                console.log("STATUS 404: USER NOT FOUND");
                res.status(404).send("USER NOT FOUND");
                return;
            }
        
            const response = await MongoUserService.deleteUser( userId );


            logger.info(`STATUS 204: ${req.method} ${req.url}`);
            console.log(`STATUS 204: USER ${userToDelete} DELETED`);
            res.status(204).json(response);

        } catch(error){
            logger.error(`STATUS 500: ${req.method} ${req.url}`);
            console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
            res.status(500).send("INTERNAL ERROR");
        }
    }
}