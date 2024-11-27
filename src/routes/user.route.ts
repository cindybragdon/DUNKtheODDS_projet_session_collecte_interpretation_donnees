import { Router } from 'express';
import { MongoUserController } from '../controllers/user.controller';
import express from 'express';
import { authenticateToken } from '../middlewares/auth.middlewares';


const router = Router();
const mongoUserController = new MongoUserController();

router.use(express.json()); //Important sinon les jsons post ne marchent pas avec postman

router.post('/users/login', mongoUserController.login);

router.post('/users/signIn', mongoUserController.signIn);

router.put('/users', authenticateToken, mongoUserController.modifyUser);

router.delete('/users', authenticateToken, mongoUserController.deleteUser);

export default router;