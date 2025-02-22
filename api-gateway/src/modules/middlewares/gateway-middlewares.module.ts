import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { routeMappings } from "../mapper/route-mapping";
import { Guard } from "./guard";
@Module({
    //providers: [AuthService, DataService],
})
export class GatewayMiddlewaresModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const protectedRoutes = routeMappings
            .filter(route => route.protected)
            .map(route => route.gatewayPath);

        consumer
            .apply(Guard)
            .forRoutes(...protectedRoutes); // Usando o operador spread
    }
}