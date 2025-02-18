import { Document, Schema, model } from "mongoose";

import { IUser } from "src/interfaces/auth.interface";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        optional: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        optional: true,
        trim: true
    },
    profileImg: {
        type: String,
        optional: true,
    },
    gender: {
        type: String,
        optional: true,
        enum: ['male', 'female']
    },
    status: {
        type: String,
        enum: ['Active', 'Deactive','Blocked'],
        default: 'Active',
        required: true
    }

}, {
    timestamps: true,
}
);

export const UserModel = model<IUser & Document>('User',userSchema)