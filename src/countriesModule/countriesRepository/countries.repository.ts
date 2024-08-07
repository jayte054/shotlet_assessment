import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CountryEntity } from '../countriesEntity/countries.entity';
import axios from 'axios';

@Injectable()
export class CountryRepository extends Repository<CountryEntity> {
  private logger = new Logger('CountryRepository');
  constructor(private dataSource: DataSource) {
    super(CountryEntity, dataSource.createEntityManager());
  }
  //data integration
  countryData = async (
    page: number = 1,
    pageSize: number = 10,
    region?: string,
    minPopulation?: number,
    maxPopulation?: number,
  ) => {
    const { data } = await axios.get(`https://restcountries.com/v3.1/name/all`);
    let countries = data;
    if (region) {
      countries = countries.filter((country) => country.region === region);
    }
    if (minPopulation !== undefined) {
      countries = countries.filter(
        (country) => country.population >= minPopulation,
      );
    }
    if (maxPopulation !== undefined) {
      countries = countries.filter(
        (country) => country.population <= maxPopulation,
      );
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const pagination = countries.slice(startIndex, endIndex);

    const endResult = {
      currentPage: page,
      totalPages: Math.ceil(countries.length / pageSize),
      totalCountries: countries.length,
      countries: pagination.map((country) => ({
        name: country.name.common,
        region: country.region,
        population: country.population,
        area: country.area,
        languages: country.languages
          ? Object.keys(country.languages).map(
              (lang) => country.languages[lang],
            )
          : [],
      })),
    };
    console.log(endResult);
    return endResult;
  };

  //==get region api====
  getRegion = async () => {
    const getRegions = await axios.get(`https://restcountries.com/v3.1/all`);
    const regions = getRegions.data.reduce(
      (
        acc: Record<string, { countries: any[]; totalPopulation: number }>,
        country: any,
      ) => {
        const regionName = country.region || 'unknown';

        if (!acc[regionName]) {
          acc[regionName] = { countries: [], totalPopulation: 0 };
        }

        acc[regionName].totalPopulation += country.population;

        acc[regionName].countries.push({
          name: country.name.common,
          population: country.population,
          languages: country.languages
            ? Object.keys(country.languages).map((lang) => ({
                lang,
                name: country.languages[lang].name,
              }))
            : [],
          area: country.area,
        });
        return acc;
      },
      {},
    );
    console.log(regions);
    return regions;
  };

  //====get languages api====//
  getLanguages = async () => {
    const { data } = await axios.get(`https://restcountries.com/v3.1/all`);
    const languages = data.reduce(
      (
        acc: Record<string, { countries: any[]; totalSpeakers: number }>,
        country: any,
      ) => {
        const population = country.population || 0;

        if (country.languages) {
          Object.keys(country.languages).forEach((lang) => {
            const language = country.languages[lang];

            if (!acc[language]) {
              acc[language] = { countries: [], totalSpeakers: 0 };
            }
            acc[language].countries.push(country.name.common);
            acc[language].totalSpeakers += population;
          });
        }
        return acc;
      },
      {},
    );
    console.log(languages);
    return languages;
  };

  //=====getAggregatedStats api ====
  getAggregatedStats = async () => {
    const { data } = await axios.get('https://restcountries.com/v3.1/all');

    const aggregatedData = data.reduce(
      (
        acc: {
          totalCountries: number;
          largestCountry: { name: string; area: number };
          smallestPopulationCountry: { name: string; population: number };
          languageStats: Record<string, { totalSpeakers: number }>;
        },
        country: any,
      ) => {
        // Total number of countries
        acc.totalCountries += 1;

        // Largest country by area
        if (!acc.largestCountry || country.area > acc.largestCountry.area) {
          acc.largestCountry = {
            name: country.name.common,
            area: country.area,
          };
        }

        // Smallest country by population
        if (
          !acc.smallestPopulationCountry ||
          country.population < acc.smallestPopulationCountry.population
        ) {
          acc.smallestPopulationCountry = {
            name: country.name.common,
            population: country.population,
          };
        }

        // Aggregate language statistics
        if (country.languages) {
          Object.keys(country.languages).forEach((langCode) => {
            const languageName = country.languages[langCode];

            if (!acc.languageStats[languageName]) {
              acc.languageStats[languageName] = { totalSpeakers: 0 };
            }

            acc.languageStats[languageName].totalSpeakers += country.population;
          });
        }

        return acc;
      },
      {
        totalCountries: 0,
        largestCountry: { name: '', area: 0 },
        smallestPopulationCountry: { name: '', population: Infinity },
        languageStats: {},
      },
    );

    // Find the most widely spoken language
    const mostWidelySpokenLanguage = Object.keys(
      aggregatedData.languageStats,
    ).reduce((widest, lang) => {
      return aggregatedData.languageStats[lang].totalSpeakers >
        aggregatedData.languageStats[widest].totalSpeakers
        ? lang
        : widest;
    }, Object.keys(aggregatedData.languageStats)[0]);

    // Output the aggregated data
    const result = {
      totalCountries: aggregatedData.totalCountries,
      largestCountry: aggregatedData.largestCountry,
      smallestPopulationCountry: aggregatedData.smallestPopulationCountry,
      mostWidelySpokenLanguage: {
        language: mostWidelySpokenLanguage,
        totalSpeakers:
          aggregatedData.languageStats[mostWidelySpokenLanguage].totalSpeakers,
      },
    };

    return result;
  };
}
