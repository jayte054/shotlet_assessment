import { Test, TestingModule } from '@nestjs/testing';
import { GetCountryRepository } from './getCountryRepository';
import { DataSource } from 'typeorm';
import { RedisService } from '../countriesService/redis.service';
import axios from 'axios';
import { GetCountryEntity } from '../countriesEntity/countries.entity';

jest.mock('axios');

describe('GetCountryRepository', () => {
  let getCountryRepository: GetCountryRepository;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCountryRepository,
        {
          provide: DataSource,
          useValue: { createEntityManager: jest.fn().mockReturnValue({}) }, // Mock DataSource
        },
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              incr: jest.fn(),
              expire: jest.fn(),
              set: jest.fn(),
              get: jest.fn(),
            }),
          }, // Mock RedisService
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);

    getCountryRepository =
      module.get<GetCountryRepository>(GetCountryRepository);
  });

  it('should be defined', () => {
    expect(getCountryRepository).toBeDefined();
  });

  it('should return the requested country data', async () => {
    const mockCountry = new GetCountryEntity();
    mockCountry.name = 'Brazil';
    mockCountry.language = JSON.stringify('Portuguese');
    mockCountry.population = 212559409;
    mockCountry.borders = [
      'ARG',
      'BOL',
      'COL',
      'GUF',
      'GUY',
      'PRY',
      'PER',
      'SUR',
      'URY',
      'VEN',
    ];
    mockCountry.area = 8515767;
    mockCountry.save = jest.fn().mockResolvedValue(mockCountry);
    // const countryData = {
    //   name: 'Brazil',
    //   language: '"Brazil"',
    //   population: 212559409,
    //   borders: [
    //     'ARG',
    //     'BOL',
    //     'COL',
    //     'GUF',
    //     'GUY',
    //     'PRY',
    //     'PER',
    //     'SUR',
    //     'URY',
    //     'VEN',
    //   ],
    //   area: 8515767,
    //   id: 'fd305241-3ea4-4bb2-a2f3-da2c6a77861a',
    // };
    jest.spyOn(redisService.getClient(), 'get').mockResolvedValue(null);

    (axios.get as jest.Mock).mockResolvedValue({
      data: [
        {
          name: { common: 'Brazil' },
          languages: { por: 'Portuguese' },
          population: 212559409,
          borders: [
            'ARG',
            'BOL',
            'COL',
            'GUF',
            'GUY',
            'PRY',
            'PER',
            'SUR',
            'URY',
            'VEN',
          ],
          area: 8515767,
        },
      ],
    });

    jest
      .spyOn(GetCountryEntity.prototype, 'save')
      .mockResolvedValue(mockCountry);

    const result = await getCountryRepository.getCountry('brazil');
    expect(result.name).toEqual('Brazil');
    expect(result.language).toEqual(JSON.stringify('Brazil'));
    expect(result.population).toEqual(212559409);
    expect(result.borders).toEqual([
      'ARG',
      'BOL',
      'COL',
      'GUF',
      'GUY',
      'PRY',
      'PER',
      'SUR',
      'URY',
      'VEN',
    ]);
    expect(result.area).toEqual(8515767);
  });
});
