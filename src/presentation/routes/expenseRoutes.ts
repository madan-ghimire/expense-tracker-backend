// === presentation/routes/expenseRoutes.ts ===
import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";
import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorize";

const router: Router = Router();

/**
 * @swagger
 * /api/expense/getAll:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: A list of all expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                     example: "Grocery"
 *                   amount:
 *                     type: number
 *                     example: 150
 *                   category:
 *                     type: string
 *                     example: "Food"
 *                   userId:
 *                     type: string
 *                     example: "user_123"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.get("/api/expense/getAll", authenticate, getAllExpenses);

/**
 * @swagger
 * /api/expense/getById/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense
 *     responses:
 *       200:
 *         description: Expense found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 category:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Expense not found
 */

router.get("/api/expense/getById/:id", getExpense);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - category
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Grocery"
 *               amount:
 *                 type: number
 *                 example: 150
 *               category:
 *                 type: string
 *                 example: "Food"
 *               userId:
 *                 type: string
 *                 example: "user_123"
 *     responses:
 *       201:
 *         description: Expense created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 category:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.post("/api/expenses", authenticate, authorize("ADMIN"), createExpense);

/**
 * @swagger
 * /api/expense/{id}:
 *   put:
 *     summary: Update an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Grocery"
 *               amount:
 *                 type: number
 *                 example: 200
 *               category:
 *                 type: string
 *                 example: "Utilities"
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       404:
 *         description: Expense not found
 */
router.put("/api/expense/:id", authenticate, updateExpense);

/**
 * @swagger
 * /api/expense/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the expense to delete
 *     responses:
 *       204:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete(
  "/api/expense/:id",
  authenticate,
  authorize("ADMIN"),
  deleteExpense
);

export default router;
