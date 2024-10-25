import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException, HttpStatus, HttpException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { RegisterDto } from './register.dto';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController 
{
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto)
  {
    try
    {

        return this.authService.register(registerDto.email, registerDto.password);
    }
    
    catch (error)
    {
        if (error instanceof ConflictException)
        {
            throw new HttpException(error,HttpStatus.CONFLICT)
        }
        else
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  private async userWithoutPassword(user : User) : Promise<any>
  {
    const { password, ...result } = user;
    return result;
  }
}