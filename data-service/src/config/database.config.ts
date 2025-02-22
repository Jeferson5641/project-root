import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User], //estáva dessa maneira antes: [__dirname + '/../**/*.entity{.ts,.js}']
    synchronize: true, // de forma alguma deve ser usado em Produção
    logging: true, // como indicação da propria tabnine para o documento eu o coloquei, mas não está ativado porque no documento
    // não existe essa propriedade
});