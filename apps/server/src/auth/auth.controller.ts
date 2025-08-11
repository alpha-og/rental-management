import {
    Controller,
    Post,
    Res,
    UnauthorizedException,
    HttpStatus,
    Get,
} from "@nestjs/common";
import { Body, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/user.dto";
import { LoginDto } from "./login.dto";
import { Public } from "./public.decorator";
import type { Response, Request } from "express";
import {
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiTags,
    ApiCookieAuth,
    ApiBearerAuth,
} from "@nestjs/swagger";

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
    user: {
        sub: string;
        userId: string;
    };
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post("login")
    @ApiOperation({ summary: "Log in a user" })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The user has been successfully logged in.",
        schema: {
            type: "object",
            properties: {
                accessToken: {
                    type: "string",
                    example: "your_access_token",
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized.",
    })
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
    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The user has been successfully registered.",
        schema: {
            type: "object",
            properties: {
                accessToken: {
                    type: "string",
                    example: "your_access_token",
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Bad request.",
    })
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
    @Get("logout") // Changed to POST for better security
    @ApiBearerAuth()
    @ApiCookieAuth()
    @ApiOperation({ summary: "Log out a user" })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The user has been successfully logged out.",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Logged out successfully",
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized.",
    })
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
    @ApiBearerAuth()
    @ApiCookieAuth()
    @ApiOperation({ summary: "Refresh the access token" })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "The access token has been successfully refreshed.",
        schema: {
            type: "object",
            properties: {
                accessToken: {
                    type: "string",
                    example: "your_new_access_token",
                },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Unauthorized.",
    })
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
