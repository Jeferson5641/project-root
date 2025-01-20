import { InternalServerErrorException } from "@nestjs/common";

export class DataServiceUnavailableException extends InternalServerErrorException {
    constructor() {
        super("the data service is currently unavailable.");
    }
}