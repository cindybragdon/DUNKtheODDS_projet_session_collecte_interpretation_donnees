import { Router } from 'express';
import express from 'express';
import { MongoGamesController } from '../controllers/game.controller';


const router = Router();
const mongoGamesController = new MongoGamesController

router.use(express.json());


/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games
 *     description: Retrieve a list of all games, including home and away team details, points, and scheduled date.
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: A list of games.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *             example:
 *               - homeTeamName: "Team A"
 *                 homePoints: 90
 *                 awayTeamName: "Team B"
 *                 awayPoints: 85
 *                 scheduled: "2024-12-13T18:30:00.000Z"
 *               - homeTeamName: "Team C"
 *                 homePoints: 70
 *                 awayTeamName: "Team D"
 *                 awayPoints: 78
 *                 scheduled: "2024-12-14T20:00:00.000Z"
 *       404:
 *         description: No games found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "GAMES NOT FOUND"
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "INTERNAL ERROR"
 */
router.get('/games', mongoGamesController.getAllGames);


/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         homeTeamName:
 *           type: string
 *           description: The name of the home team.
 *         homePoints:
 *           type: integer
 *           description: The points scored by the home team.
 *         awayTeamName:
 *           type: string
 *           description: The name of the away team.
 *         awayPoints:
 *           type: integer
 *           description: The points scored by the away team.
 *         scheduled:
 *           type: string
 *           format: date-time
 *           description: The date and time the game is scheduled.
 *       required:
 *         - homeTeamName
 *         - homePoints
 *         - awayTeamName
 *         - awayPoints
 *         - scheduled
 *       example:
 *         homeTeamName: "Nuggets"
 *         homePoints: 90
 *         awayTeamName: "Celtics"
 *         awayPoints: 85
 *         scheduled: "2024-12-13T18:30:00.000Z"
 */

export default router;