import { ApiProperty } from "@nestjs/swagger";

export class GatewayRouteDto {
    @ApiProperty({ example: '/users/one/:id', description: 'Caminho no gateway' })
    gatewayPath: string;

    @ApiProperty({ example: '/auth/one/:id', description: 'Caminho no serviço de destino' })
    targetPath: string;

    @ApiProperty({ example: 'auth', description: 'Nome do serviço alvo' })
    service: string;

    @ApiProperty({ example: 'GET', description: 'Método HTTP permitido' })
    method: string;

    @ApiProperty({ example: false, description: 'Se a rota é protegida (exige autenticação)' })
    protected: boolean;

    @ApiProperty({ example: true, description: 'Se a rota exige um payload válido' })
    validatePayload: boolean;
}