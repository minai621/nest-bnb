import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoredUserEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { LoginUserDTO, SignupUserDTO } from './dto/signup-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as config from 'config';

const jwtConfig = config.get('jwt');
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async foundUser(email: string): Promise<StoredUserEntity> {
    const found = await this.authRepository.findOne(email);
    if (!found) {
      throw new NotFoundException(`이미 존재하는 이메일 입니다 ${email}.`);
    }
    return found;
  }

  async createUser(
    signupUserDTO: SignupUserDTO,
  ): Promise<Partial<Pick<SignupUserDTO, 'password'>>> {
    try {
      await this.authRepository.createUser(signupUserDTO);
      const user = {
        ...signupUserDTO,
        profileImage:
          '../public/static/image/user/default_user_profile_image.jpg',
      };
      const newUserWithoutPassword: Partial<Pick<SignupUserDTO, 'password'>> =
        user;
      delete newUserWithoutPassword.password;
      return newUserWithoutPassword;
    } catch (e) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
  }

  async loginUser(
    loginUserDTO: LoginUserDTO,
  ): Promise<{ newUserWithoutPassword; accessToken: string }> {
    const { email, password } = loginUserDTO;
    const user = await this.authRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const newUserWithoutPassword: Partial<Pick<LoginUserDTO, 'password'>> =
        loginUserDTO;
      delete newUserWithoutPassword.password;
      const accessToken = await this.jwtService.sign(newUserWithoutPassword);
      return { newUserWithoutPassword, accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async getMe(req: Request) {
    try {
      const { access_token } = req.cookies;
      if (!access_token) {
        return 'access_token이 없습니다.';
      }
      const userData = this.jwtService.verify(access_token, jwtConfig.secret);
      const user = await this.authRepository.findOne({ email: userData.email });
      if (!user) {
        return '해당 유저가 없습니다.';
      }
      const userWithoutPassword: Partial<Pick<SignupUserDTO, 'password'>> =
        userData;
      return userWithoutPassword;
    } catch (e) {
      return '';
    }
  }
}
