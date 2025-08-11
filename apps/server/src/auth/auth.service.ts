import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "../user/user.dto";
import { User } from "../user/user.model";
import { LoginDto } from "./login.dto";

// Define interfaces for type safety
interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

interface JwtPayload {
    sub: string;
}

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }
        return user;
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const validatedUser = await this.validateUser(
            loginDto.email,
            loginDto.password,
        );
        if (!validatedUser) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload: JwtPayload = { sub: validatedUser.id };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: "1h",
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            expiresIn: "7d",
        });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.setRefreshToken(
            validatedUser.id,
            hashedRefreshToken,
        );

        return { accessToken, refreshToken };
    }

    async register(userDto: CreateUserDto): Promise<AuthResponse> {
        const existingUser = await this.userService.findByEmail(userDto.email);
        if (existingUser) {
            throw new UnauthorizedException("Username already exists");
        }
        const newUser = await this.userService.create(userDto);
        // Generate tokens directly instead of calling login
        const payload: JwtPayload = { sub: newUser.id };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: "1h",
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            expiresIn: "7d",
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.setRefreshToken(newUser.id, hashedRefreshToken);
        return { accessToken, refreshToken };
    }

    async logout(userId: string): Promise<void> {
        await this.userService.clearRefreshToken(userId);
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        try {
            const payload: JwtPayload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
            });
            const user = await this.userService.findOne(payload.sub);
            if (!user) {
                throw new UnauthorizedException("User not found");
            }
            if (!user.refreshToken) {
                throw new UnauthorizedException(
                    "No refresh token found for user",
                );
            }

            const isRefreshTokenValid = await bcrypt.compare(
                refreshToken,
                user.refreshToken,
            );
            if (!isRefreshTokenValid) {
                throw new UnauthorizedException("Invalid refresh token");
            }
            const newPayload: JwtPayload = { sub: payload.sub };
            const newAccessToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: "1h",
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: "7d",
            });
            const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
            await this.userService.setRefreshToken(
                payload.sub,
                hashedRefreshToken,
            );

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
}
