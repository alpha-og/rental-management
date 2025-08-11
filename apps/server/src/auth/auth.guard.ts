import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

interface JwtPayload {
    sub: string;
}

interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("No token provided");
        }

        try {
            const secretKey = this.configService.get<string>("JWT_SECRET");
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: secretKey,
            });
            request.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException("Invalid token");
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return undefined;
        }
        const [type, token] = authHeader.split(" ");
        return type === "Bearer" ? token : undefined;
    }
}
