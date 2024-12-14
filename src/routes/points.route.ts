import { Router } from 'express';
import express from 'express';
import { MongoPointsController } from '../controllers/points.controller';


const router = Router();
const mongoPointsController = new MongoPointsController();

router.use(express.json());

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Get all points
 *     description: Retrieve all points from the database.
 *     tags:
 *       - Points
 *     responses:
 *       200:
 *         description: A list of points.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *             example:
 *               - team1Name: "Team A"
 *                 team2Name: "Team B"
 *                 team1Points: 50
 *                 team2Points: 45
 *                 pointsDifference: 5
 *                 numberOfPlayedGames: 10
 *               - team1Name: "Team C"
 *                 team2Name: "Team D"
 *                 team1Points: 60
 *                 team2Points: 55
 *                 pointsDifference: 5
 *                 numberOfPlayedGames: 12
 *       404:
 *         description: Points not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "POINTS NOT FOUND"
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "INTERNAL ERROR"
 */

router.get('/points', mongoPointsController.getAllPoints);

/**
 * @swagger
 * components:
 *   schemas:
 *     Point:
 *       type: object
 *       properties:
 *         team1Name:
 *           type: string
 *           description: Name of team 1.
 *         team2Name:
 *           type: string
 *           description: Name of team 2.
 *         team1Points:
 *           type: integer
 *           description: Points scored by team 1.
 *         team2Points:
 *           type: integer
 *           description: Points scored by team 2.
 *         pointsDifference:
 *           type: integer
 *           description: Difference in points between the two teams.
 *         numberOfPlayedGames:
 *           type: integer
 *           description: Number of games played.
 *       required:
 *         - team1Name
 *         - team2Name
 *         - team1Points
 *         - team2Points
 *         - numberOfPlayedGames
 *       example:
 *         team1Name: "Team A"
 *         team2Name: "Team B"
 *         team1Points: 50
 *         team2Points: 45
 *         pointsDifference: 5
 *         numberOfPlayedGames: 10
 */


export default router;