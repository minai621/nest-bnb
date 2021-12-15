import { Injectable } from '@nestjs/common';
import { StoredUserType } from './auth.model';
import { v1 as uuid } from 'uuid';
import { SignupUserDTO } from './dto/signup-user.dto';

@Injectable()
export class AuthService {
  private users: StoredUserType[] = [];

  getAllUser(): StoredUserType[] {
    return this.users;
  }

  signupUser(signupUserDTO: SignupUserDTO) {
    const { email, password, firstname, lastname, birthday } = signupUserDTO;
    if (!email || !firstname || !lastname || !password || !birthday) {
      return;
    }
  }

  userExist(email: string) {
    // todos
  }
}
