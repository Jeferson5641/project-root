import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvConfig } from "./env-variables";

@Global()
@Module({
    imports: [ConfigModule.forRoot()],
    providers: [EnvConfig],
    exports: [EnvConfig],
})
export class EnvConfigModule { }