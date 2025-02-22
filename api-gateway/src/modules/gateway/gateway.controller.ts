import { All, Body, Controller, HttpException, HttpStatus, Logger, Request, Res } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { routeMappings } from "../mapper/route-mapping";
import { GatewayRouteDto } from "../swagger/gateway-route.dto";
import { GatewayService } from "./gateway.service";
import { Response } from "express";
import { Guard } from "../middlewares/guard";
import { NotFoundException } from "../exceptions/not-found.exception";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { InternalServerException } from "../exceptions/internal-server.exception";

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {

    private readonly logger = new Logger(GatewayController.name);

    constructor(private readonly gatewayService: GatewayService) { }

    @All('*')
    @ApiOperation({
        summary: 'Forwards the request to the correct service',
        description: 'This endpoint acts as a request router, directing them to the appropriate services.'
    })
    @ApiResponse({ status: 200, description: 'Request processed successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid payload.' })
    @ApiResponse({ status: 404, description: 'Route not found.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    @ApiBody({ type: GatewayRouteDto, required: false, description: 'Optional payload for POST and PUT requests' })
    async handleRequest(@Request() req, @Body() body, @Res() res: Response) {
        this.logger.log(`Original URL: ${req.originalUrl}`);

        const path = req.originalUrl.replace('/gateway', '');
        this.logger.log(`Receiving request for path: ${path}`);

        const matchingRoute = routeMappings.find(route => {
            const regex = new RegExp(`^${route.gatewayPath.replace(/:[^/]+/g, '([^/]+)')}$`);
            return regex.test(path);
        });

        if (!matchingRoute) {
            this.logger.error(`Route not found: ${req.originalUrl}`);
            throw new NotFoundException();
        }

        this.logger.log(`Matching route found: ${JSON.stringify(matchingRoute)}`);

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
            throw new BadRequestException();
        }

        // Redirecionamento para o serviço alvo
        try {
            const result = await this.gatewayService.forwardRequest(service, finalPath, req.method, body);
            res.status(200).send(result);
        } catch (error) {
            this.logger.error(`Error redirecting request: ${error.message}`);
            throw new InternalServerException(error.message);
        }
    }
}