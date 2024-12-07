import { Router } from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import AuthController from "../controllers/auth-controller.js";
import ChatGroupController from "../controllers/chatgroup-controller.js";
import ChatGroupUserController from "../controllers/chat-group-user-controller.js";
import ChatsController from "../controllers/chats-controller.js";

const router = Router();

// auth routes
router.post("/auth/login", AuthController.login);

// chat group routes
router.post("/chat-group", authMiddleware, ChatGroupController.store);
router.get("/chat-group", authMiddleware, ChatGroupController.index)
router.get("/chat-group/:id", ChatGroupController.show)
router.put("/chat-group/:id", authMiddleware, ChatGroupController.update)
router.delete("/chat-group/:id", authMiddleware, ChatGroupController.destroy)

// chat group users routes 
router.get("/chat-group-users", ChatGroupUserController.index);
router.post("/chat-group-users", ChatGroupUserController.store);

// chats (messages)
router.get("/chats/:id", ChatsController.index);


export default router;
