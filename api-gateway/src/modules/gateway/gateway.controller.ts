import { All, Body, Controller, HttpException, HttpStatus, Post, Request, Response } from "@nestjs/common";
import { GatewayService } from "./gateway.service";
import { routeMappings } from "../mapper/route-mapping";
import { AuthMiddleware } from "../middlewares/gateway-middlewares";

@Controller()
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) { }

    @All('*')
    async handleRequest(@Request() req, @Body() body, @Response() res) {
        const matchingRoute = routeMappings.find(route => route.gatewayPath === req.path);

        if (!matchingRoute) {
            throw new HttpException('Route not found', HttpStatus.NOT_FOUND);
        }

        const { service, targetPath, protected: isProtected, validatePayload } = matchingRoute;

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
            const data = await this.gatewayService.forwardRequest(service, targetPath, req.method, body);
            res.json(data);
        } catch (error) {
            throw new HttpException(
                `Error processing request: ${error.message}`,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}