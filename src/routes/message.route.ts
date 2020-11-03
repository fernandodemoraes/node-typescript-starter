import { Router } from "express";
import messageController from "../controllers/message.controller";
import authMiddleware from "../middlewares/auth.middleware";

const messageRouter = Router();

messageRouter.post(
    '/:id',
    authMiddleware.authorizeUserByParams,
    authMiddleware.authorizeUserByToken,
    messageController.send
);

messageRouter.get(
    '/:id',
    authMiddleware.authorizeUserByParams,
    authMiddleware.authorizeUserByToken,
    messageController.list
);

export default messageRouter;