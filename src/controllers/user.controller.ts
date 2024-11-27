import { Request, Response } from 'express';
import { logger } from '../logs/winston';
import mongoose from 'mongoose';
import { MongoUser, validateMongoUser } from '../models/mongoUser.model';
import { MongoUserService } from '../services/user.service';
import { config } from '../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

//https://mongoosejs.com/docs/api/model.html#Model.find()
//https://mongoosejs.com/docs/api/model.html#Model.findById()




export class MongoUserController {

    public async login(req: Request, res: Response): Promise<void> {
        try {

            const email = req.body.email;
            const password = req.body.password;
            const username = req.body.username;

            if(!validateMongoUser(req.body) || typeof password !== 'string' || typeof username !== 'string'){
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: USER CAN'T LOG");
                res.status(400).send("STATUS 400 : ERROR WITH YOUR REQUEST");
                return;
            }

            const userToLogin = await MongoUserService.getUser(email);
                
            if (!userToLogin) {
    
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: INCORRECT PASSWORD OR EMAIL");
                res.status(401).send('INCORRECT PASSWORD OR EMAIL' );
                return;
            }
 
            const isValidPassword = await bcrypt.compare(password, userToLogin.password);
            if (!isValidPassword) {
                logger.error(`STATUS 401 : ${req.method} ${req.url}`);
                console.log("STATUS 401: INCORRECT PASSWORD OR EMAIL");
                res.status(401).send('INCORRECT PASSWORD OR EMAIL');
                return;
            }

            // Génération d'un JWT
            const token = jwt.sign({ userToLogin }, config.jwtSecret, { expiresIn: '1h' });
            
            logger.info(`STATUS 200: ${req.method} ${req.url}`);
            console.log("STATUS 200: WELCOME");
            res.status(200).json({"token":token});
            

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
                console.log(userToSignIn)
                logger.error(`STATUS 400 : ${req.method} ${req.url}`);
                console.log("STATUS 400: NEW USER NOT ADDED");
                res.status(400).send("STATUS 400 : ERROR WITH YOUR REQUEST");
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