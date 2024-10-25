import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService
{
    private readonly logger : Logger = new Logger(AuthService.name)

  constructor( private usersService: UsersService, private jwtService: JwtService, private configService : ConfigService)
  {}

  /**
   * Validates the user email and password
   * @param email The user's email
   * @param password The user's password
   * @returns The user object, w/o the email on success. NULL on failure
   */
  async validateUser(email: string, password: string): Promise<any>
  {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password))
    {
      const { password, ...result } = user;
      return result; //return user object w/o the password.
    }
    return null;
  }

  async login(user: any)
  {
    const payload = { email: user.email, sub: user.id };
    this.logger.log(`Logging in user: ${payload.email}`)
    this.logger.debug(`Expiration set to ${this.configService.get<string>('auth.jwt.expiresIn')}`)

    return {
      access_token: this.jwtService.sign(payload), 
      expires_in: this.configService.get<string>('auth.jwt.expiresIn'),
    };
  }

  async register(email: string, password: string)
  {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser)
    {

        throw new ConflictException('Email already exists');
    }

    try
    {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({ email, password: hashedPassword, });
        this.logger.log(`New User: ${user.email} with ID: ${user.id}`)
        const { password: _, ...result } = user;
        return result;
    }
    catch (error)
    {
      throw new InternalServerErrorException(error);
    }
  }
}