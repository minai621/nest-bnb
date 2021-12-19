import { EntityRepository, Repository } from 'typeorm';
import { StoredUserEntity } from './auth.entity';
import { SignupUserDTO } from './dto/signup-user.dto';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(StoredUserEntity)
export class AuthRepository extends Repository<StoredUserEntity> {
  async createUser(signupUserDTO: SignupUserDTO) {
    const { email, password, firstname, lastname, birthday } = signupUserDTO;
    const index = await this.findOne({
      order: {
        id: 'DESC',
      },
    });
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user: StoredUserEntity = this.create({
      id: index.id + 1,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      birthday,
    });
    try {
      await this.save(user);
      return user;
    } catch (error) {
      throw new BadRequestException(
        `잘못된 데이터입니다. Error: ${error.code}`,
      );
    }
  }
}
