import { Module } from '@nestjs/common';
import { CountryService } from './countriesService/countries.service';
import { CountryRepository } from './countriesRepository/countries.repository';
import { CountryController } from './countriesController/countries.controller';
import { GetCountryRepository } from './countriesRepository/getCountryRepository';
import { RedisService } from './countriesService/redis.service';
import { AuthModule } from 'src/authModule/authModule';
import {
  CountryEntity,
  GetCountryEntity,
} from './countriesEntity/countries.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CountryEntity, GetCountryEntity, AuthEntity]),
  ],
  providers: [
    CountryRepository,
    GetCountryRepository,
    CountryService,
    RedisService,
  ],
  controllers: [CountryController],
})
export class CountryModule {}
