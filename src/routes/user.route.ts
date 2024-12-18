import { Router } from 'express';
import { MongoUserController } from '../controllers/user.controller';
import express from 'express';
import { authenticateToken, authorizeUser, verifyAdminUserRight } from '../middlewares/auth.middlewares';


const router = Router();
const mongoUserController = new MongoUserController();

router.use(express.json()); 

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Log in a user by verifying their email and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: "user@example.com"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Incorrect email or password.
 *       500:
 *         description: Internal server error.
 */
router.post('/users/login', mongoUserController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Requires authentication and authorization.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found.
 *       500:
 *         description: Internal server error.
 */
router.get('/users', authenticateToken, authorizeUser, mongoUserController.getAllUsers);


/**
 * @swagger
 * /users/signIn:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user. Requires admin rights.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: "newuser"
 *             email: "newuser@example.com"
 *             password: "password123"
 *             role: "User"
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or email already exists.
 *       500:
 *         description: Internal server error.
 */
router.post('/users/signIn',verifyAdminUserRight, mongoUserController.signIn);


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modify a user
 *     description: Update user details. Requires authentication and authorization.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             username: "updateduser"
 *             email: "updateduser@example.com"
 *             password: "newpassword123"
 *             role: "User"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: User not found.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */
router.put('/users/:id', authenticateToken, authorizeUser, verifyAdminUserRight, mongoUserController.modifyUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID. Requires authentication and authorization.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */
router.delete('/users/:id', authenticateToken, authorizeUser, mongoUserController.deleteUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The user's username.
 *         email:
 *           type: string
 *           description: The user's email.
 *         password:
 *           type: string
 *           description: The user's password.
 *         role:
 *           type: string
 *           description: The user's role.
 *           enum:
 *             - Admin
 *             - User
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       example:
 *         username: "testuser"
 *         email: "testuser@example.com"
 *         password: "securepassword"
 *         role: "User"
 *   securitySchemes:
 *     bearerAuth:
 *       type: https
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;