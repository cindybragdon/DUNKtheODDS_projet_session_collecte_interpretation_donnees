import { Router } from 'express';
import express from 'express';
import { MongoPointsController } from '../controllers/points.controller';


const router = Router();
const mongoPointsController = new MongoPointsController();

router.use(express.json()); //Important sinon les jsons post ne marchent pas avec postman

router.get('/points', mongoPointsController.getAllPoints);

export default router;