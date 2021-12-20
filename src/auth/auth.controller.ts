import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginUserDTO, SignupUserDTO } from './dto/signup-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body(ValidationPipe) signupUserDTO: SignupUserDTO) {
    return this.authService.createUser(signupUserDTO);
  }

  @Post('/login')
  async logininUser(
    @Body() loginUserDTO: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { newUserWithoutPassword, accessToken } =
      await this.authService.loginUser(loginUserDTO);
    res.cookie('access_token', accessToken, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 3600),
    });
    res.send({ newUserWithoutPassword, accessToken });
  }

  @Get('/me')
  getMe(@Req() req: Request) {
    return this.authService.getMe(req);
  }

  @Delete('/logout')
  logoutUser(@Res() res: Response) {
    res.cookie('access_token', '', {
      expires: new Date(0),
    });
    res.end();
  }
}
