import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { EnvConfig } from "../environment/env-variables";

@Injectable()
export class GatewayService {
    private readonly logger = new Logger(GatewayService.name);
    private readonly serviceClients: Record<string, AxiosInstance>;

    constructor(
        private readonly envConfig: EnvConfig,
    ) {
        this.logger.log('Initializing GatewayService');
        this.serviceClients = {
            auth: axios.create({ baseURL: `${this.envConfig.authServiceUrl}` }),
            data: axios.create({ baseURL: `${this.envConfig.dataServiceUrl}` }),
        };
        this.logger.log(`Service Clients Initialized: ${JSON.stringify(Object.keys(this.serviceClients))}`);
    }

    async forwardRequest(service: string, targetPath: string, method: string, data?: any) {

        this.logger.log(`Forwarding request - Service: ${service}, Path: ${targetPath}, Method: ${method}`);
        if (data) {
            this.logger.debug(`Request payload: ${JSON.stringify(data)}`);
        }

        try {
            const client = this.serviceClients[service];
            const response = await client.request({
                url: targetPath,
                method,
                data,
            });

            this.logger.log(`Response received from ${service}-service`);
            this.logger.debug(`Response data: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            this.logger.error(`Error forwarding request to ${service}-service: ${error.message}`);
            this.logger.error(`Error details: ${JSON.stringify(error.response?.data || error.message)}`);
            throw new InternalServerErrorException(`Failed to communicate with ${service}-service`);
        }
    }
}