// DTO는 class, interface로 작성한다.
export class SignupUserDTO {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthday: string;
  profileImage: string;
}

export class LoginUserDTO {
  email: string;
  password: string;
}
