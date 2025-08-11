import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findOne(id: string): Promise<User | null> {
        return this.userModel.findByPk(id);
    }

    async create(userData: CreateUserDto): Promise<User> {
        try {
            if (!userData.username || !userData.password) {
                throw new Error("Username and password are required");
            }
            const hashedPassword: string = await bcrypt.hash(
                userData.password,
                10,
            );

            return this.userModel.create({
                username: userData.username,
                passwordHash: hashedPassword,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            throw new Error(`Error creating user: ${errorMessage}`);
        }
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const user = await this.findOne(id);
        if (user) {
            return user.update(userData);
        }
        return null;
    }

    async delete(id: string): Promise<void> {
        const user = await this.findOne(id);
        if (user) {
            await user.destroy();
        }
    }
    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { username },
        });
    }
    async setRefreshToken(
        id: string,
        refreshToken: string,
    ): Promise<User | null> {
        const user = await this.findOne(id);
        if (user) {
            user.refreshToken = refreshToken;
            return user.save();
        }
        return null;
    }
    async clearRefreshToken(id: string): Promise<User | null> {
        const user = await this.findOne(id);
        if (user) {
            user.refreshToken = undefined;
            return user.save();
        }
        return null;
    }
}
