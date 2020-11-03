import { model, Schema, Document } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface UserModel extends UserInterface, Document {
    comparePasswords(passaword: string): Promise<boolean>;
    generateToken(): string;
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    }
});

UserSchema.pre<UserModel>('save', async function encryptPassword() {
    this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.pre<UserModel>('save', function generateAvatar() {
    const randomId = Math.floor(Math.random() * (1000000)) + 1;

    this.avatar = `https://api.adorable.io/avatar/285/${randomId}.png`
});

UserSchema.methods.comparePasswords = function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}

UserSchema.methods.generateToken = function(): string {
    const decodedToken = {
        _id: String(this._id),
        name: this.name,
        avatar: this.avatar
    }

    return jwt.sign(decodedToken, 'HxAmB;);', {
        expiresIn: '1d'
    });
}

export default model<UserModel>('User', UserSchema);