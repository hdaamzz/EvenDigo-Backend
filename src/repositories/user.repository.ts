import { UserModel } from "../models/UserModel";
import { IUser } from "../interfaces/auth.interface";
import { MongoError } from 'mongodb';

export class UserRepository{
    async createUser(userData: IUser): Promise<IUser> {
        try {
            const user = new UserModel(userData);
    
            const savedUser = await user.save();
    
            return savedUser;
        } catch (error: unknown) {
            console.log(error);
            
            if (error instanceof MongoError && (error as any).code === 11000) {
                throw new Error('Email already exists');
            }
            console.error("Error while creating user:", error);
            throw new Error('Failed to create user');
        }
    }


    async findByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }

    async updateLastLogin(userId: string | undefined): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
          lastLogin: new Date()
        });
    }
}