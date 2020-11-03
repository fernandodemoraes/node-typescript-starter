import { Request, Response } from "express";
import userModel from "../models/user.model";

class UserController {

    public async register(request: Request, response: Response): Promise<Response> {
        const user = await userModel.create(request.body);
        const registerResponse = {
            message: 'User successfully registered!',
            _id: user._id,
            name: user.name,
        }

        return response.json(registerResponse);
    }

    public async authenticate(request: Request, response: Response): Promise<Response> {
        const { name, password } = request.body;
        const user = await userModel.findOne( { name });

        if (!user) {
            return response.status(400).send({
                message: 'User not found!'
            });
        }

        const passwordIsValid = await user.comparePasswords(password);

        if (!passwordIsValid) {
            return response.status(400).send({
                message: 'Incorrect password!'
            });
        }

        return response.json({
            user,
            token: user.generateToken()
        });
    }

    public getById(request: Request, response: Response): Response {
        return response.json(request.userChat);
    }

    public async list(request: Request, response: Response): Promise<Response> {
        const loggedUserId = request.user._id;

        const users = await userModel.find( { _id: { $ne: loggedUserId } });

        return response.json(users);
    }
}

export default new UserController();