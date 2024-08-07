import { Controller } from '@nestjs/common';
import { Get, Param, Query, UseGuards } from '@nestjs/common/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { CountryService } from '../countriesService/countries.service';
import { GetCountryEntity } from '../countriesEntity/countries.entity';
import { ApiKeyGuard } from 'src/authModule/authRepository/apiKeyGuard';

@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @ApiOperation({
    summary:
      'Retrieve a list of countries with pagination and optional filtering by region or population size.',
  })
  @ApiResponse({ status: 201, description: 'countries fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/getData')
  async countryData() {
    return await this.countryService.countryData();
  }

  @ApiOperation({
    summary:
      'Retrieve detailed information for a specific country, including its languages, population, area, and bordering countries.',
  })
  @ApiResponse({ status: 201, description: 'country fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Get('/getCountry/:name')
  async getCountry(@Param('name') name: string) {
    return await this.countryService.getCountry(name);
  }

  @ApiSecurity('api-key')
  @ApiOperation({
    summary: 'Retrieve saved country data from the database',
  })
  @ApiResponse({ status: 201, description: 'country fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(ApiKeyGuard)
  @Get()
  async fetchCountryData(
    @Query('sortBy') sortBy: keyof GetCountryEntity,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.countryService.fetchCountryData(sortBy, order);
  }

  @ApiSecurity('api-key')
  @ApiOperation({
    summary:
      ' Retrieve a list of regions and the countries within each region, with additional aggregated data such as the total population of the region.',
  })
  @ApiResponse({ status: 201, description: 'regions fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(ApiKeyGuard)
  @Get('/getRegions')
  async getRegion() {
    return await this.countryService.getRegions();
  }

  @ApiSecurity('api-key')
  @ApiOperation({
    summary:
      ' Retrieve a list of languages and the countries where they are spoken. Include the total number of speakers globally for each language.',
  })
  @ApiResponse({ status: 201, description: 'languages fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(ApiKeyGuard)
  @Get('/getLanguages')
  async getLanguages() {
    return await this.countryService.getLanguages();
  }

  @ApiSecurity('api-key')
  @ApiOperation({
    summary:
      'Provide aggregated statistics such as the total number of countries, the largest country by area, the smallest by population, and the most widely spoken language.',
  })
  @ApiResponse({
    status: 201,
    description: 'aggregated stats fetched successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseGuards(ApiKeyGuard)
  @Get('/getAggregatedStats')
  async getAggregatedStats() {
    return await this.countryService.getAggregatedStats();
  }
}
