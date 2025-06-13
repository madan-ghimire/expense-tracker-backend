import { Router } from "express";
import { createExpense } from "../controllers/expenseController";

const router: Router = Router();

router.post("/expenses", createExpense);

export default router;
