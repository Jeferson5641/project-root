import { ApiProperty } from "@nestjs/swagger";

export class GatewayRouteDto {
    @ApiProperty({ example: '/users/one/:id', description: 'Path at the gateway' })
    gatewayPath: string;

    @ApiProperty({ example: '/auth/one/:id', description: 'Path in destination service' })
    targetPath: string;

    @ApiProperty({ example: 'auth', description: 'Target service name' })
    service: string;

    @ApiProperty({ example: 'GET', description: 'HTTP method allowed' })
    method: string;

    @ApiProperty({ example: false, description: 'Whether the route is protected (requires authentication)' })
    protected: boolean;

    @ApiProperty({ example: true, description: 'If the route requires a valid payload' })
    validatePayload: boolean;
}