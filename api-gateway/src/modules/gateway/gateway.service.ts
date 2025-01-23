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
        this.serviceClients = {
            auth: axios.create({ baseURL: `${this.envConfig.authServiceUrl}` }),
            data: axios.create({ baseURL: `${this.envConfig.dataServiceUrl}` }),
        };
    }

    async forwardRequest(service: string, targetPath: string, method: string, data?: any) {
        try {
            const client = this.serviceClients[service];
            const response = await client.request({
                url: targetPath,
                method,
                data,
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error forwarding request to ${service}-service: ${error.message}`);
            throw new InternalServerErrorException(`Failed to communicate with ${service}-service`);
        }
    }
}