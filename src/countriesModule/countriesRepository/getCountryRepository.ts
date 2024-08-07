import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { GetCountryEntity } from '../countriesEntity/countries.entity';
import axios from 'axios';
import { RedisService } from '../countriesService/redis.service';

@Injectable()
export class GetCountryRepository extends Repository<GetCountryEntity> {
  private logger = new Logger('CountryRepository');
  private readonly rateLimitKeyPrefix = 'rate-limit:country';
  constructor(
    private dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {
    super(GetCountryEntity, dataSource.createEntityManager());
  }

  //=====private methods for caching====//
  private async incrementRequestcount(
    key: string,
    ttl: number,
  ): Promise<number> {
    const redis = this.redisService.getClient();
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, ttl);
    }
    return count;
  }

  private async checkRateLimit(
    key: string,
    limit: number,
    ttl: number,
  ): Promise<void> {
    const requestCount = await this.incrementRequestcount(key, ttl);
    if (requestCount > limit) {
      throw new BadRequestException('Rate limit exceeded');
    }
  }

  private async cacheData(key: string, data: any): Promise<void> {
    const redis = this.redisService.getClient();
    await redis.set(key, JSON.stringify(data), 'EX', 3600); //cache for 1 hour
  }

  private async getCachedData(key: string): Promise<any> {
    const redis = this.redisService.getClient();
    const data = await redis.get(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  //====endpoint for getting a particular country and its details====//
  getCountry = async (name: string) => {
    const cachedKey = `country:${name}`;
    const rateLimitKey = `${this.rateLimitKeyPrefix}:${name}`;
    const limit = 5;
    const ttl = 60;

    await this.checkRateLimit(rateLimitKey, limit, ttl);

    const cachedData = await this.getCachedData(cachedKey);
    if (cachedData) {
      console.log(cachedData);
      return cachedData;
    }
    try {
      const { data } = await axios.get(
        `https://restcountries.com/v3.1/name/${name}`,
      );
      const result = data.map((data) => ({
        name: data.name.common,
        languages: data.languages,
        population: data.population,
        borders: data.borders,
        area: data.area,
      }));
      console.log(result);
      const country = new GetCountryEntity();
      country.name = result[0].name;
      country.language = JSON.stringify(result[0].name);
      country.population = result[0].population;
      country.borders = result[0].borders;
      country.area = result[0].area;

      await country.save();
      await this.cacheData(cachedKey, country);

      this.logger.verbose(
        `data for country ${country.name} saved successfully`,
      );
      return country;
    } catch (error) {
      console.log(error);
      this.logger.error(`failed to retrieve data for country`);
      throw new InternalServerErrorException();
    }
  };

  //====endpoint for fetching saved data from the database==///
  fetchCountryData = async (
    sortBy: keyof GetCountryEntity,
    order: 'ASC' | 'DESC' = 'ASC',
  ) => {
    const options: FindOneOptions<GetCountryEntity> = {
      order: {
        [sortBy]: order,
      },
    };
    const fetchCountries = await GetCountryEntity.find(options);

    if (fetchCountries.length === 0) {
      throw new NotFoundException();
    }
    console.log(fetchCountries);
    return fetchCountries;
  };
}
