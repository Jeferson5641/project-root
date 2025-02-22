import { HttpException } from "@nestjs/common";

export class GenericHttpException extends HttpException {
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
    }
}