import { Router } from 'express';
import express from 'express';
import { MongoTeamInfoController } from '../controllers/teamiNFO.controller';


const router = Router();
const mongoTeamInfoController = new MongoTeamInfoController();

router.use(express.json());



/**
 * @swagger
 * /teamInfos:
 *   get:
 *     summary: Get all team infos
 *     description: Retrieve all team infos from the database.
 *     tags:
 *       - TeamInfos
 *     responses:
 *       200:
 *         description: A list of team infos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamInfo'
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
 *         description: Team infos not found.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "TEAM INFOS NOT FOUND"
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: "INTERNAL ERROR"
 */
router.get('/teamInfos', mongoTeamInfoController.getAllTeamInfo);




/**
 * @swagger
 * components:
 *   schemas:
 *     TeamInfo:
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