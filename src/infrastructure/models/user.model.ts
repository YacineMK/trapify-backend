import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, 
});

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>('User', userSchema);

