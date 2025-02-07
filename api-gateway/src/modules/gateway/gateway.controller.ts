import { All, Body, Controller, HttpException, HttpStatus, Logger, Post, Request, Response } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { routeMappings } from "../mapper/route-mapping";
import { AuthMiddleware } from "../middlewares/gateway-middlewares";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GatewayRouteDto } from "../swagger/gateway-route.dto";

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
    async handleRequest(@Request() req, @Body() body, @Response() res) {
        const matchingRoute = routeMappings.find(route => {
            const regex = new RegExp(`^${route.gatewayPath.replace(/:\w+/g, '\\w+')}$`);
            return regex.test(req.path);
        });

        if (!matchingRoute) {
            throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
        }

        const { service, targetPath, protected: isProtected, validatePayload } = matchingRoute;

        const paramsMatch = req.path.match(new RegExp(`^${matchingRoute.gatewayPath.replace(/:[^/]+/g, '([^/]+)')}$`));
        const paramKeys = matchingRoute.gatewayPath.match(/:[^/]+/g) || [] as string[];
        const params = paramKeys.reduce((acc, key, index) => {
            (acc as Record<string, string>)[key.replace(':', '')] = paramsMatch ? paramsMatch[index + 1] || '' : '';
            return acc;
        }, {} as Record<string, string>);

        var finalPath = matchingRoute.targetPath;
        Object.entries(params).forEach(([key, value]) => {
            finalPath = finalPath.replace(`:${key}`, value);
        });

        // Proteção (autenticação/validação de token)
        if (isProtected) {
            const authMiddleware = new AuthMiddleware();
            authMiddleware.use(req, res, () => { });
        }

        // Validação de Payload (se necessário)
        if (validatePayload && (!body || Object.keys(body).length === 0)) {
            throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
        }

        // Redirecionamento para o serviço alvo
        try {
            const data = await this.gatewayService.forwardRequest(
                service,
                finalPath,
                req.method,
                body);
            res.json(data);
        } catch (error) {
            throw new HttpException(
                `Error processing request: ${error.message}`,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}