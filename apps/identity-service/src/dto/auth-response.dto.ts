import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    example: {
      id: 'uuid',
      email: 'user@example.com',
      roles: ['user'],
    },
  })
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

export class UserResponseDto {
  @ApiProperty({ example: 'uuid', description: 'ID do usuário' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({
    example: ['user'],
    description: 'Papéis do usuário (roles)',
  })
  roles: string[];
}
