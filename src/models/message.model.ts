import { DocumentQuery, model, Schema } from "mongoose";
import { MessageInterface } from "../interfaces/message.interface";

interface MessageModel extends MessageInterface, Document {} 
interface MassageStatic extends Model<MessageModel> {
    searchChat(loggedUserId: string, chatUserId: string): DocumentQuery<MessageModel[], MessageModel>
}

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

MessageSchema.statics.searchChat = function(loggedUserId: string, chatUserId: string): DocumentQuery<MessageModel[], MessageModel> {
    return this.find({
        $or: [
            {$and: [{ sender: loggedUserId }, { recipient: chatUserId }]},
            {$and: [{ sender: chatUserId }, { recipient: loggedUserId }]}
        ]
    });
}

export default model<MessageModel, MassageStatic>('Message', MessageSchema);