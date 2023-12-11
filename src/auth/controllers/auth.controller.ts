import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '../dtos/auth.dto';

class LoginDtoInfo {
  @ApiProperty({
    description: 'Username for login',
    example: 'user1',
  })
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'secretpassword',
  })
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Login',
    description: 'Login with username and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({
    type: LoginDtoInfo,
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }
}
