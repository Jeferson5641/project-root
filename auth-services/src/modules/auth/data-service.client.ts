import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class DataServiceClient {
    private readonly logger = new Logger(DataServiceClient.name);

    constructor(private readonly httpService: HttpService) { }

    async createUserInDataService(user: { username: string; email: string; password: string }): Promise<any> {
        const dataServiceUrl = process.env.DATA_SERVICE_URL;

        if (!dataServiceUrl) {
            this.logger.error("DATA_SERVICE_URL is not defined in environment variables.");
            throw new InternalServerErrorException("Configuration error: DATA_SERVICE_URL is not set.");
        }

        const url = `${dataServiceUrl}/users/create`;

        try {
            const response = await lastValueFrom(
                this.httpService.post(url, user),
            );
            this.logger.log(`User successfully created in data-service: ${response.data}`);
            return response.data;

        } catch (error) {
            if (error.response && error.response.status === 400) {
                this.logger.warn(`Bad request when creating user: ${JSON.stringify(error.response.data)}`);
                throw new BadRequestException(error.response.data.message || "Failed to create user due to invalid data.");
            }

            this.logger.error("Error communicating with data-service:", error);
            throw new InternalServerErrorException("Failed to communicate with data-service.");
        }
    }

    // async findUserByEmail(email: string): Promise<any> {

    //     const url = `${process.env.DATA_SERVICE_URL}/users/${email}`;
    //     const response = await lastValueFrom(this.httpService.get(url));
    //     console.log(`User found by email: ${response.data}`);
    //     return response.data;  // Retorna os dados do usuário

    // }

    async findUserByEmail(email: string): Promise<any> {
        const url = `${process.env.DATA_SERVICE_URL}/users/email/${email}`;
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            console.log(`User found by email:`, response.data);
            return response.data; // Retorna os dados do usuário
        } catch (error) {
            console.error(`Error finding user by email: ${email}`, error);
            throw new UnauthorizedException('User not found or invalid credentials');
        }
    }
}