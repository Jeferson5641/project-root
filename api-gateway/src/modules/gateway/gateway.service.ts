import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { EnvConfig } from "../environment/env-variables";

@Injectable()
export class GatewayService {
    private readonly logger = new Logger(GatewayService.name);
    private readonly serviceClients: Record<string, AxiosInstance[]>;
    private readonly roundRobinIndexes: Record<string, number>;

    constructor(
        private readonly envConfig: EnvConfig,
    ) {
        this.logger.log('Initializing GatewayService');

        const authInstances = [

            axios.create({ baseURL: `${this.envConfig.authServicesUrl}` }),
            axios.create({ baseURL: `${this.envConfig.authServicesUrl2}` }),
        ]

        const dataInstances = [
            axios.create({ baseURL: `${this.envConfig.dataServiceUrl}` }),
            axios.create({ baseURL: `${this.envConfig.dataServiceUrl2}` }),
        ];

        this.serviceClients = {
            auth: authInstances,
            data: dataInstances,
        };

        this.roundRobinIndexes = {
            auth: 0,
            data: 0,
        }
        this.logger.log(`Service Clients Initialized: ${JSON.stringify(Object.keys(this.serviceClients))}`);
    }

    private getNextInstance(service: string): AxiosInstance {
        const instances = this.serviceClients[service];
        if (!instances) {
            throw new InternalServerErrorException(`Service ${service} not found`);
        }

        const index = this.roundRobinIndexes[service] ?? 0;
        const instance = instances[index];

        this.roundRobinIndexes[service] = (index + 1) % instances.length;

        return instance;
    }

    async forwardRequest(service: string, targetPath: string, method: string, data?: any) {

        this.logger.log(`Forwarding request - Service: ${service}, Path: ${targetPath}, Method: ${method}`);
        if (data) {
            this.logger.debug(`Request payload: ${JSON.stringify(data)}`);
        }

        try {
            const client = this.getNextInstance(service);
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
            throw new InternalServerErrorException(`Failed to communicate with ${service}-service. Error: ${error.message}`);
        }
    }
}