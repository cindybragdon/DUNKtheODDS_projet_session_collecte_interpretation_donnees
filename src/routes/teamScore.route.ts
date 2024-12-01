import { Router } from 'express';
import express from 'express';
import { MongoTeamScoreController } from '../controllers/teamScore.controller';


const router = Router();
const mongoTeamScoreController = new MongoTeamScoreController();

router.use(express.json());



/**
 * @swagger
 * /teamScores:
 *   get:
 *     summary: Get all team scores
 *     description: Retrieve all team scores from the database.
 *     tags:
 *       - TeamScores
 *     responses:
 *       200:
 *         description: A list of team scores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamScore'
 *             example:
 *               - teamName: "Team A"
 *                 homeWins: 10
 *                 homeLosts: 5
 *                 awayWins: 8
 *                 awayLosts: 7
 *               - teamName: "Team B"
 *                 homeWins: 12
 *                 homeLosts: 3
 *                 awayWins: 9
 *                 awayLosts: 4
 *       404:
 *         description: Team scores not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "TEAM SCORES NOT FOUND"
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "INTERNAL ERROR"
 */
router.get('/teamScores', mongoTeamScoreController.getAllTeamScores);




/**
 * @swagger
 * components:
 *   schemas:
 *     TeamScore:
 *       type: object
 *       properties:
 *         teamName:
 *           type: string
 *           description: The name of the team.
 *         homeWins:
 *           type: integer
 *           description: The number of home games won by the team.
 *         homeLosts:
 *           type: integer
 *           description: The number of home games lost by the team.
 *         awayWins:
 *           type: integer
 *           description: The number of away games won by the team.
 *         awayLosts:
 *           type: integer
 *           description: The number of away games lost by the team.
 *       required:
 *         - teamName
 *         - homeWins
 *         - homeLosts
 *         - awayWins
 *         - awayLosts
 *       example:
 *         teamName: "Team A"
 *         homeWins: 10
 *         homeLosts: 5
 *         awayWins: 8
 *         awayLosts: 7
 */


export default router;