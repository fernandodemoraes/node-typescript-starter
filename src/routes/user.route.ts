import { Router } from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.authenticate);

userRouter.get(
    '/:id',
    authMiddleware.authorizeUserByParams,
    authMiddleware.authorizeUserByToken,
    userController.getById
);

userRouter.get(
    '/',
    authMiddleware.authorizeUserByToken,
    userController.list
);

export default userRouter;