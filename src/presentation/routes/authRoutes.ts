import { Router } from "express";
import { register } from "../controllers/authController";

const router: Router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - firstName
 *               - lastName
 *               - displayName
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: johndoe_01
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               displayName:
 *                 type: string
 *                 example: John D.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssw0rd123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or user already exists
 */

router.post("/auth/signup", register);

export default router;
