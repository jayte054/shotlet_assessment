import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { config } from 'dotenv';

config();
@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    });
  }

  ///initializing redis======
  getClient(): Redis {
    try{
    return this.redis;
    }catch(error){
      throw new InternalServerErrorException()
    }
  }
}
