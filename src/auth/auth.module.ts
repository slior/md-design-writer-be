import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../config/auth.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('auth.jwt.secret'),
          signOptions: {
            expiresIn: configService.get<string>('auth.jwt.expiresIn'),
          },
        }),
        inject: [ConfigService],
      })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
