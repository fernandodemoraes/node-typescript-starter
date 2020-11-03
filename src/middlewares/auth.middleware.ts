import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserInterface } from "../interfaces/user.interface";
import userModel from "../models/user.model";

class AuthMiddleware {

    public async authorizeUserByToken(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        const token = request.query.token || request.headers['x-access-token'];

        if (!token) {
            return response.status(401).send({
                message: 'Restricted access!'
            });
        }

        try {
            const userToken = jwt.verify(String(token), 'HxAmB;);') as UserInterface;
            const user = await userModel.findById(userToken._id);
    
            if (!user) {
                return response.status(400).send({
                    message: 'User does not exist!'
                });
            }

            request.user = user;

            return next();
        } catch (error) {
            return response.status(401).send({
                message: 'Invalid token!'
            });
        }
    }

    public async authorizeUserByParams(request: Request, response: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await userModel.findById(request.params.id);
    
            if (!user) {
                return response.status(400).send({
                    message: 'User does not exist!'
                });
            }

            request.userChat = user;

            return next();
        } catch (error) {
            return response.status(401).send({
                message: 'Invalid user!'
            });
        }
    }
}

export default new AuthMiddleware();