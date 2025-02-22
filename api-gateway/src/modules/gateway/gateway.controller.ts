import { All, Body, Controller, HttpException, HttpStatus, Logger, Request, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { routeMappings } from "../mapper/route-mapping";
import { GatewayRouteDto } from "../swagger/gateway-route.dto";
import { GatewayService } from "./gateway.service";
import { Response } from "express";
import { Guard } from "../middlewares/guard";

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {

    private readonly logger = new Logger(GatewayController.name);

    constructor(private readonly gatewayService: GatewayService) { }

    @All('*')
    @ApiOperation({
        summary: 'Encaminha a requisição para o serviço correto',
        description: 'Este endpoint atua como um roteador de requisições, direcionando para os serviços apropriados.'
    })
    @ApiResponse({ status: 200, description: 'Requisição processada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Payload inválido.' })
    @ApiResponse({ status: 404, description: 'Rota não encontrada.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    @ApiBody({ type: GatewayRouteDto, required: false, description: 'Payload opcional para requisições POST e PUT' })
    async handleRequest(@Request() req, @Body() body, @Res() res: Response) {
        this.logger.log(`Original URL: ${req.originalUrl}`);

        const path = req.originalUrl.replace('/gateway', '');
        this.logger.log(`Recebendo requisição para o caminho: ${path}`);

        const matchingRoute = routeMappings.find(route => {
            const regex = new RegExp(`^${route.gatewayPath.replace(/:[^/]+/g, '([^/]+)')}$`);
            return regex.test(path);
        });

        if (!matchingRoute) {
            this.logger.error(`Rota não encontrada: ${req.originalUrl}`);
            throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
        }

        this.logger.log(`Rota correspondente encontrada: ${JSON.stringify(matchingRoute)}`);

        const { service, protected: isProtected, validatePayload } = matchingRoute;

        // Extração dos parâmetros da rota
        const paramsMatch = new RegExp(`^${matchingRoute.gatewayPath.replace(/:[^/]+/g, '([^/]+)')}$`).exec(path);

        const paramKeys = matchingRoute.gatewayPath.match(/:[^/]+/g) || [] as string[];

        const params = paramKeys.reduce((acc, key, index) => {
            (acc as Record<string, string>)[key.replace(':', '')] = paramsMatch ? paramsMatch[index + 1] || '' : '';
            return acc;
        }, {} as Record<string, string>);

        // Substituição dos parâmetros na rota alvo
        let finalPath = matchingRoute.targetPath;
        Object.entries(params).forEach(([key, value]) => {
            finalPath = finalPath.replace(`:${key}`, value);
        });

        if (isProtected) {
            const guard = new Guard();
            guard.use(req, res, () => { });
        }

        // Validação de Payload (se necessário)
        if (validatePayload && !body) {
            throw new HttpException('Payload inválido', HttpStatus.BAD_REQUEST);
        }

        // Redirecionamento para o serviço alvo
        try {
            const result = await this.gatewayService.forwardRequest(service, finalPath, req.method, body);
            res.status(200).send(result);
        } catch (error) {
            this.logger.error(`Erro ao redirecionar a requisição: ${error.message}`);
            res.status(error.response?.status || 500).send({ message: 'Erro interno do servidor' });
        }
    }
}