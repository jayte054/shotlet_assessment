import { Module } from '@nestjs/common';
import { AuthRepository } from './authRepository/authRepository';
import { AuthService } from './authService/authService';
import { AuthController } from './authController/authController';
import { ApiKeyGuard } from './authRepository/apiKeyGuard';

@Module({
  imports: [],
  providers: [AuthRepository, AuthService, ApiKeyGuard],
  controllers: [AuthController],
  exports: [AuthRepository, ApiKeyGuard],
})
export class AuthModule {}
