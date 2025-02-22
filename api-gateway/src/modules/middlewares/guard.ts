import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class Guard implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const [, token] = authHeader.split(' ');

        // Validação de token básica (ou use JWT)
        if (!token || token !== 'valid-token') {
            throw new UnauthorizedException('Invalid token');
        }

        next();
    }
}