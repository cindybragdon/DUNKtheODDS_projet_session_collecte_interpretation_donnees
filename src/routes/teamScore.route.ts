import { Router } from 'express';
import express from 'express';
import { MongoTeamScoreController } from '../controllers/teamScore.controller';


const router = Router();
const mongoTeamScoreController = new MongoTeamScoreController();

router.use(express.json()); //Important sinon les jsons post ne marchent pas avec postman

router.get('/teamScores', mongoTeamScoreController.getAllTeamScores);

export default router;