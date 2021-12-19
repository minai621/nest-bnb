import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupUserDTO } from './dto/signup-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body(ValidationPipe) signupUserDTO: SignupUserDTO) {
    return this.authService.createUser(signupUserDTO);
  }

  @Post('/signin')
  async signinUser(
    @Body() signupUserDTO: SignupUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { newUserWithoutPassword, accessToken } =
      await this.authService.signinUser(signupUserDTO);
    res.cookie('access_token', accessToken);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test() {
    return 'test';
  }
}
