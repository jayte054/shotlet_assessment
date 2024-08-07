import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../authService/authService';
import { AuthDto, authObject } from 'src/types';

@ApiTags('apiKey-authentication')
@Controller('/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'generate apiKey for the user and save the user' })
  @ApiResponse({ status: 201, description: 'user apiKey created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/generateApiKey')
  async generateApiKey(
    @Body(ValidationPipe) authDto: AuthDto,
  ): Promise<authObject> {
    return await this.authService.generateApiKey(authDto);
  }

  @ApiOperation({ summary: 'validate apikey' })
  @ApiResponse({
    status: 201,
    description: 'user apiKey validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/validateApiKey/:apiKey')
  async validateApiKey(@Param('apiKey') apiKey: string): Promise<authObject> {
    return await this.authService.validateApiKey(apiKey);
  }
}
