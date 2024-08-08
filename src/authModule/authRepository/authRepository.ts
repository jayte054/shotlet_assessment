import { DataSource, Repository } from 'typeorm';
import { AuthEntity } from '../authEntity/authEntity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { authObject, AuthDto } from 'src/types';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  private logger = new Logger('AuthRepository');
  constructor(private dataSource: DataSource) {
    super(AuthEntity, dataSource.createEntityManager());
  }

  //====endpoint for generating apikey for any user ====
  async generateApiKey(authDto: AuthDto): Promise<authObject> {
    const { username } = authDto;

    const user = await AuthEntity.find({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    const apiKey = randomBytes(32).toString('hex');
    const newUser = new AuthEntity();
    newUser.username = username;
    newUser.apiKey = apiKey;

    try {
      //=====save user details===
      await newUser.save();
      this.logger.verbose('api key successfully generated');
      return {
        id: newUser.id,
        username: newUser.username,
        apiKey: newUser.apiKey,
      };
    } catch (error) {
      console.log(error);
      this.logger.error('error creating api key');
      throw new InternalServerErrorException();
    }
  }

  //====endpoint for validating apiKey =====
  async validateApiKey(apiKey: string): Promise<authObject | null> {
    const user = await this.findOne({ where: { apiKey } });
    return user
      ? {
          id: user.id,
          username: user.username,
          apiKey: user.apiKey,
        }
      : null;
  }
}
