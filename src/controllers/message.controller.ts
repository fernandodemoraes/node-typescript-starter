import { Request, Response } from "express";
import messageModel from "../models/message.model";

class MessageController {

    public async send(request: Request, response: Response): Promise<Response> {
        const message = await messageModel.create({
            text: request.body.text,
            sender: request.user._id,
            recipient: request.userChat._id
        });

        return response.json(message);
    }

    public async list(request: Request, response: Response): Promise<Response> {
        const loggedUserId = request.user._id;
        const chatUserId = request.userChat._id;

        const messages = await messageModel.searchChat(loggedUserId, chatUserId).sort('createdAt');

        const messageChat = messages.map(message => {
            return {
                text: message.text,
                createdAt: message.createdAt,
                isSender: message.sender == String(loggedUserId)
            }
        });

        return response.json(messageChat);
    }
}

export default new MessageController();