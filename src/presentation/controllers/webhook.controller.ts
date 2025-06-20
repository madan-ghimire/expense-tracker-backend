import { Request, Response } from "express";

export const webhookHandler = (req: Request, res: Response) => {
  const event = req.body;

  console.log("📩 Webhook received:", event);

  switch (event.type) {
    case "expense.created":
      console.log("🧾 Expense Created:", event.data);
      // You could insert logic to update DB or trigger actions
      break;

    default:
      console.warn("⚠️ Unhandled event type:", event.type);
  }

  res.status(200).json({ success: true });
};
