import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfig } from 'src/config/env-variables';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly envConfig: EnvConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: envConfig.jwtSecret,
        });
    }

    async validate(payload: any) {
        return { username: payload.username };
    }
}
