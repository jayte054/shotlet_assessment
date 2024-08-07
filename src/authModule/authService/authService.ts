import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../authRepository/authRepository';
import { Injectable } from '@nestjs/common';
import { AuthDto, authObject } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
  ) {}

  generateApiKey = async (authDto: AuthDto): Promise<authObject> => {
    return await this.authRepository.generateApiKey(authDto);
  };

  validateApiKey = async (apiKey: string): Promise<authObject> => {
    return await this.authRepository.validateApiKey(apiKey);
  };
}
