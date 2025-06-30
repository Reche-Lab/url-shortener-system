export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

export class UserResponseDto {
  id: string;
  email: string;
  roles: string[];
}
