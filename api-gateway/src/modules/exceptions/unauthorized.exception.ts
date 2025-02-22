import { HttpException, HttpStatus } from "@nestjs/common";

export class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized access') {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}