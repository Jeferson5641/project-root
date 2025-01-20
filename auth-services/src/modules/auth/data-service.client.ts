import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { EnvConfig } from "src/config/env-variables";

@Injectable()
export class DataServiceClient {
    private readonly logger = new Logger(DataServiceClient.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly envConfig: EnvConfig
    ) { }

    async createUserInDataService(user: { username: string; email: string; password: string }): Promise<any> {
        const dataServiceUrl = this.envConfig.dataServiceUrl;

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

    async findUserByEmail(email: string): Promise<any> {
        const url = `${this.envConfig.dataServiceUrl}/users/email/${email}`;
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            console.log(`User found by email:`, response.data);
            return response.data; // Retorna os dados do usuário
        } catch (error) {
            console.error(`Error finding user by email: ${email}`, error);
            throw new UnauthorizedException('User not found or invalid credentials');
        }
    }

    async findUserById(id: number): Promise<any> {
        //const url = this.envConfig.dataServiceUrl;
        try {
            const response = await this.httpService.axiosRef.get(`${this.envConfig.dataServiceUrl}/users/one/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user by ID ${id}:`, error.message);
            throw error
        }
    }

    async findAllUsers(): Promise<any[]> {
        const url = this.envConfig.dataServiceUrl;
        try {
            const response = await this.httpService.axiosRef.get(`${url}/users/all`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching all users:`, error.message);
            throw error;
        }
    }

    async updateUser(id: number, updateUserDto: Partial<CreateUserDto>) {
        const url = `${this.envConfig.dataServiceUrl}/users/update/${id}`;
        this.logger.log(`Sending update request to ${url} with payload: ${JSON.stringify(updateUserDto)}`);

        try {
            const response = await lastValueFrom(this.httpService.put(url, updateUserDto));
            this.logger.log(`User with ID ${id} updated successfully: ${response.data}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                this.logger.error(
                    `Failed to update user with ID ${id}. Status: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}`
                );

                // Re-throw the original error for better debugging
                throw new BadRequestException(error.response.data.message || 'Failed to update user due to invalid data.');
            }
            this.logger.error(`Failed to update user with ID ${id}`, error.message);
            throw new InternalServerErrorException('Failed to update user');
        }
    }

    async deleteUser(id: number) {
        const dataServiceUrl = this.envConfig.dataServiceUrl;
        const url = `${dataServiceUrl}/users/delete/${id}`;
        return lastValueFrom(this.httpService.delete(url));
    }
}