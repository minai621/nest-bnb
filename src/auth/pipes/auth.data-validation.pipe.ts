import { BadRequestException, PipeTransform } from '@nestjs/common';
import { SignupUserDTO } from '../dto/signup-user.dto';

export class AuthDataValidationPipe implements PipeTransform {
  transform(value: SignupUserDTO) {
    if (!this.isDataValid(value)) {
      throw new BadRequestException(`잘못된 데이터를 전송하였습니다. ${value}`);
    }
    return value;
  }
  private isDataValid({
    email,
    password,
    firstname,
    lastname,
    birthday,
  }: SignupUserDTO) {
    if (!email || !password || !firstname || !lastname || !birthday) {
      return 0;
    }
    return 1;
  }
}
