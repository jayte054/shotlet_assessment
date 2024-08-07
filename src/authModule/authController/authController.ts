import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../authService/authService';
import { AuthDto, authObject } from 'src/types';

@Controller('/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/generateApiKey')
  async generateApiKey(
    @Body(ValidationPipe) authDto: AuthDto,
  ): Promise<authObject> {
    return await this.authService.generateApiKey(authDto);
  }

  @Get('/validateApiKey/:apiKey')
  async validateApiKey(@Param('apiKey') apiKey: string): Promise<authObject> {
    return await this.authService.validateApiKey(apiKey);
  }
}
