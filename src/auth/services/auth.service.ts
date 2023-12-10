import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from '../entities/jwt-token.entity';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    const validUsername = process.env.ADMIN_USER;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username !== validUsername) {
      throw new UnauthorizedException('Invalid username');
    }

    if (password !== validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: PayloadToken = {
      username,
    };

    const res: ResponseEntity = {
      message: 'User authenticated',
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    };

    return res;
  }
}
