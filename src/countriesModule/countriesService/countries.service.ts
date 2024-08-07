import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryRepository } from '../countriesRepository/countries.repository';
import { GetCountryRepository } from '../countriesRepository/getCountryRepository';
import { GetCountryEntity } from '../countriesEntity/countries.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryRepository)
    @InjectRepository(GetCountryRepository)
    private countryRepository: CountryRepository,
    private getCountryRepository: GetCountryRepository,
  ) {}

  countryData = async () => {
    return await this.countryRepository.countryData();
  };

  getCountry = async (name: string) => {
    return await this.getCountryRepository.getCountry(name);
  };

  fetchCountryData = async (
    sortBy: keyof GetCountryEntity,
    order: 'ASC' | 'DESC' = 'ASC',
  ) => {
    return await this.getCountryRepository.fetchCountryData(sortBy, order);
  };

  getRegions = async () => {
    return await this.countryRepository.getRegion();
  };

  getLanguages = async () => {
    return await this.countryRepository.getLanguages();
  };

  getAggregatedStats = async () => {
    return await this.countryRepository.getAggregatedStats();
  };
}
