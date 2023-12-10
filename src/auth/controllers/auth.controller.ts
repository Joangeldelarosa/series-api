import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
