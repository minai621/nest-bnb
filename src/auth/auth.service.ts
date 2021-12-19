import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoredUserEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { SignupUserDTO } from './dto/signup-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async getUserById(email: string): Promise<StoredUserEntity> {
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
      console.log(newUserWithoutPassword);
      return newUserWithoutPassword;
    } catch (e) {
      return e;
    }
  }

  async signinUser(
    signupUserDTO: SignupUserDTO,
  ): Promise<{ newUserWithoutPassword; accessToken: string }> {
    const { email, password } = signupUserDTO;
    const user = await this.authRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const newUserWithoutPassword: Partial<Pick<SignupUserDTO, 'password'>> =
        signupUserDTO;
      delete newUserWithoutPassword.password;
      const accessToken = await this.jwtService.sign(newUserWithoutPassword);
      return { newUserWithoutPassword, accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
