import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoredUserType } from './auth.model';
import { AuthService } from './auth.service';
import { SignupUserDTO } from './dto/signup-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/signup')
  getAllStoredUserType() {
    return this.authService.getAllUser;
  }

  @Post()
  signup(@Body() signupUserDTO: SignupUserDTO) {
    return this.authService.signupUser(signupUserDTO);
  }
}
