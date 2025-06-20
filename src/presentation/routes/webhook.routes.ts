import { Router } from "express";
import { webhookHandler } from "../controllers/webhook.controller";

const router: Router = Router();

router.post("/api/webhook", webhookHandler);

export default router;
