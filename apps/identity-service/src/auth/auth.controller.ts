import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto, UserResponseDto } from '../dto/auth-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado',
    type: UserResponseDto,
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e gerar token' })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado',
    type: AuthResponseDto,
  })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
