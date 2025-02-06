import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { EnvConfig } from "src/config/env-variables";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials.exception";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { UserRegistrationFailedException } from "../exceptions/user-registration-failed.exception";
import { DataServiceUnavailableException } from "../exceptions/dataservice-unavailable.exception";
import { UserUpdateFailedException } from "../exceptions/user-update-failed.exception";
import { GenericHttpException } from "../exceptions/generic-http.exception";

@Injectable()
export class DataServiceClient {
    private readonly logger = new Logger(DataServiceClient.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly envConfig: EnvConfig
    ) { }

    async createUserInDataService(user: { username: string; email: string; password: string }): Promise<any> {
        // const dataServiceUrl = this.envConfig.dataServiceUrl;
        const url = `${this.envConfig.dataServiceUrl}/users/create`;

        try {
            const response = await lastValueFrom(
                this.httpService.post(url, user),
            );
            this.logger.log(`User successfully created in data-service: ${response.data}`);
            return response.data;

        } catch (error) {
            if (error.response?.status === 400) {
                throw new BadRequestException(error.response.data?.message);
            }

            this.logger.error("Error communicating with data-service:", error);
            throw new InternalServerErrorException("Failed to communicate with data-service.");
        }
    }

    async findUserByEmail(email: string): Promise<any> {
        const url = `${this.envConfig.dataServiceUrl}/users/email/${email}`;
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data; // Retorna os dados do usuário
        } catch (error) {
            if (error.response?.status === 404) {
                throw new UserNotFoundException(email);
            }
            throw new DataServiceUnavailableException();
        }
    }

    async findUserById(id: number): Promise<any[]> {
        const url = `${this.envConfig.dataServiceUrl}/users/one/${id}`;
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new UserNotFoundException(id);
            }
            throw new DataServiceUnavailableException();
        }
    }

    async findAllUsers(): Promise<any[]> {
        const url = `${this.envConfig.dataServiceUrl}/users/all`;
        try {
            const response = await this.httpService.axiosRef.get(url);
            this.logger.log(`Fetched all users successfuly.`);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to fetch all users: ${error.message}`);

            if (error.response?.status === 500) {
                throw new DataServiceUnavailableException();
            } else {
                throw new GenericHttpException(error.response.data?.message || 'Failed to fetch all users.', 500);
            }
        }
    }

    async updateUser(id: number, updateUserDto: Partial<CreateUserDto>) {
        const url = `${this.envConfig.dataServiceUrl}/users/update/${id}`;

        try {
            const response = await lastValueFrom(this.httpService.put(url, updateUserDto));
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new UserUpdateFailedException(error.response.data?.message);
            }
            throw new DataServiceUnavailableException();
        }
    }

    async deleteUser(id: number) {
        const url = `${this.envConfig.dataServiceUrl}/users/delete/${id}`;
        try {
            await lastValueFrom(this.httpService.delete(url));
            this.logger.log(`User with ID ${id} deleted successfully.`);
        } catch (error) {
            throw new DataServiceUnavailableException();
        }
    }
}