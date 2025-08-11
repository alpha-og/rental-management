import { Controller, Post, Res, UnauthorizedException } from "@nestjs/common";
import { Body, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/user.dto";
import { LoginDto } from "./login.dto";
import { Public } from "./public.decorator";
import type { Response, Request } from "express";

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        userId: string;
    };
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("login")
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.authService.login(loginDto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "strict", // Adjust as needed
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Set the access token in the response header

        return { accessToken };
    }
    @Public()
    @Post("register")
    async register(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } =
            await this.authService.register(createUserDto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }
    @Post("logout") // Changed to POST for better security
    async logout(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user;
        await this.authService.logout(user.sub);
        res.clearCookie("refreshToken");
        return { message: "Logged out successfully" };
    }
    @Post("refresh")
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const cookies = req.cookies as Partial<{ refreshToken: string }>;
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found");
        }
        const { accessToken, refreshToken: newRefreshToken } =
            await this.authService.refreshToken(refreshToken);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }
}
