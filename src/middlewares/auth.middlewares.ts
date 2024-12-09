import { NextFunction } from "express";
import { Request, Response } from 'express';
import { config } from "../config/config";
import { logger } from "../logs/winston";

const jwt = require('jsonwebtoken');

// Middleware de vérification du rôle
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {

  try{
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      console.log("STATUS 401 : UNAUTHORISED");
      logger.error(`STATUS 401 : ${req.method} ${req.url}`);
      res.status(401).json({ message: "Unauthorized" });
      return;
  
    } 
    //console.log(token);
    jwt.verify(token, config.jwtSecret, (err: Error) => {
      if (err) {
        console.log("STATUS 403 : FORBIDDEN");
        logger.error(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).send("STATUS 403 : FORBIDDEN")
        return;
      }
      next();
    });
  } catch(error){
    logger.error(`STATUS 500: ${req.method} ${req.url}`);
    console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
    res.status(500).send("INTERNAL ERROR");
  }
}

export function authorizeUser(req: Request, res: Response, next: NextFunction) {

  try{
    let decoded;

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      logger.error(`STATUS 401 : ${req.method} ${req.url} - Missing Token`);
      console.log("STATUS 401 : UNAUTHORISED");
      res.status(401).json({ message: "Unauthorized - Missing Token" });
      return;
    }

    try{
        decoded = jwt.verify(token, config.jwtSecret);
    } catch(error){
      console.log("STATUS 403 : FORBIDDEN");
      logger.error(`STATUS 403 : ${req.method} ${req.url}`);
      res.status(403).send("STATUS 403 : FORBIDDEN");
      return;
    }

    //console.log(decoded.user._id);
    //console.log(decoded)
    if (decoded.user._id !== req.params.id && decoded.user.role !== "Admin") {
      console.log("STATUS 403 : FORBIDDEN");
      logger.error(`STATUS 403 : ${req.method} ${req.url}`);
      res.status(403).send("STATUS 403 : FORBIDDEN");
      return;
    }
    next();
  } catch(error){
    logger.error(`STATUS 500: ${req.method} ${req.url}`);
    console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
    res.status(500).send("INTERNAL ERROR");
  }
} 




export function verifyAdminUserRight(req: Request, res: Response, next: NextFunction) {

    try{
    let decoded;
    
    if(req.body.role === "Admin") {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        logger.error(`STATUS 401 : ${req.method} ${req.url} - Missing Token`);
        console.log("STATUS 401 : UNAUTHORISED");
        res.status(401).json({ message: "Unauthorized - Missing Token" });
        return;
      }
  
      try{
         decoded = jwt.verify(token, config.jwtSecret);
      } catch(error){
        console.log("STATUS 403 : FORBIDDEN");
        logger.error(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).send("STATUS 403 : FORBIDDEN");
        return;
      }
  
      //A User cannot become an admin by himself
      if (req.body.role === "Admin" && decoded.user.role !== "Admin") {
        console.log("STATUS 403 : FORBIDDEN");
        logger.error(`STATUS 403 : ${req.method} ${req.url}`);
        res.status(403).send("STATUS 403 : FORBIDDEN");
        return;
      }
    }

    next();
  } catch(error){
    logger.error(`STATUS 500: ${req.method} ${req.url}`);
    console.error(`STATUS 500: Error with ${req.method} ${req.url}`, error)
    res.status(500).send("INTERNAL ERROR");
  }

}