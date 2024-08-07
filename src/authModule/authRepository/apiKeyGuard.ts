import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRepository } from './authRepository';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authRepository: AuthRepository,
  ) {}

  //====endpoint for guarding endpoints, ensuring apiKey is passed ====//
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('Api key is missing');
    }

    const user = await this.authRepository.validateApiKey(apiKey);

    if (!user) {
      throw new UnauthorizedException('Invalid Api Key');
    }

    return true;
  }
}
