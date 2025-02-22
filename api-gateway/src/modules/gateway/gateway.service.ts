import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { EnvConfig } from "src/config/env-variables";

@Injectable()
export class GatewayService {
    private readonly logger = new Logger(GatewayService.name);
    private readonly serviceClients: Record<string, AxiosInstance[]>;
    private readonly roundRobinIndexes: Record<string, number>;

    constructor(private readonly envConfig: EnvConfig) {
        this.logger.log('Initializing GatewayService');

        const authInstances = [
            axios.create({ baseURL: `${this.envConfig.authServiceUrl}` }),
            axios.create({ baseURL: `${this.envConfig.authServiceUrl2}` }),
        ];

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
        };
        this.logger.log(`Service Clients Initialized: ${JSON.stringify(Object.keys(this.serviceClients))}`);
    }

    private getNextInstance(service: string): AxiosInstance {
        const instances = this.serviceClients[service];
        const index = this.roundRobinIndexes[service];
        this.roundRobinIndexes[service] = (index + 1) % instances.length;
        return instances[index];
    }

    async forwardRequest(service: string, targetPath: string, method: string, data?: any) {
        const instances = this.getNextInstance(service);

        this.logger.log(`Encaminhando requisição para: ${instances.defaults.baseURL}${targetPath} com método ${method} e dados: ${JSON.stringify(data)}`);

        const response = await instances.request({
            url: targetPath,
            method,
            data,
        });
        return response.data;

    }
}