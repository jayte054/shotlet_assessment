import { Controller } from '@nestjs/common';
import { Get, Param, Query, UseGuards } from '@nestjs/common/decorators';
import { CountryService } from '../countriesService/countries.service';
import { GetCountryEntity } from '../countriesEntity/countries.entity';
import { ApiKeyGuard } from 'src/authModule/authRepository/apiKeyGuard';

@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get('/getData')
  async countryData() {
    return await this.countryService.countryData();
  }

  @Get('/getCountry/:name')
  async getCountry(@Param('name') name: string) {
    return await this.countryService.getCountry(name);
  }

  @UseGuards(ApiKeyGuard)
  @Get()
  async fetchCountryData(
    @Query('sortBy') sortBy: keyof GetCountryEntity,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.countryService.fetchCountryData(sortBy, order);
  }

  @UseGuards(ApiKeyGuard)
  @Get('/getRegions')
  async getRegion() {
    return await this.countryService.getRegions();
  }

  @UseGuards(ApiKeyGuard)
  @Get('/getLanguages')
  async getLanguages() {
    return await this.countryService.getLanguages();
  }

  @UseGuards(ApiKeyGuard)
  @Get('/getAggregatedStats')
  async getAggregatedStats() {
    return await this.countryService.getAggregatedStats();
  }
}
