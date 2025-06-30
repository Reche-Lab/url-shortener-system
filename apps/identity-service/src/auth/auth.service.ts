import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Verificar se usuário já existe (usando IsNull para deletedAt)
    const existingUser = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      roles: ['user'],
      tenantId: 'default-tenant',
    });

    const savedUser = await this.userRepository.save(user);

    // Retornar sem a senha
    return {
      id: savedUser.id,
      email: savedUser.email,
      roles: savedUser.roles,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuário (usando IsNull para deletedAt)
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gerar JWT
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      tenantId: user.tenantId,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });
  }
}
