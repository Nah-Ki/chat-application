import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import AuthController from "../controllers/auth-controller.js";
import ChatGroupController from "../controllers/chatgroup-controller.js";

const router = Router();

// auth routes
router.post("/auth/login", AuthController.login);

// chat gruop routes
router.post("/chat-group", authMiddleware, ChatGroupController.store);
router.get("/chat-group", authMiddleware, ChatGroupController.index)
router.get("/chat-group/:id", authMiddleware, ChatGroupController.show)
router.put("/chat-group/:id", authMiddleware, ChatGroupController.update)
router.delete("/chat-group/:id", authMiddleware, ChatGroupController.destroy)

export default router;
