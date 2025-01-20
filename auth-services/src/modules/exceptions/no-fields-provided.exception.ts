import { BadRequestException } from '@nestjs/common';

export class NoFieldsProvidedException extends BadRequestException {
    constructor() {
        super('No fields were provided for the update operation.');
    }
}
