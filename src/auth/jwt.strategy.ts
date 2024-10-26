import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    private readonly logger = new Logger(JwtStrategy.name)

    constructor(private configService : ConfigService, private userService : UsersService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('auth.jwt.secret')
        });
    }

    async validate(payload: any)
    { //need to return the User object.
        let u : User = await this.userService.findByEmail(payload.email)
        if (!u)
        {
            this.logger.debug(`Could not find user for ${payload.email}`)
            return null;
        }
        return u;
    }
}