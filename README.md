<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Database: Postgres
## ORM: TypeOrm

## Entities: CountryEntity, GetCountryEntity, AuthEntity

## endpoints
authController: generateApiKey()
               validateApiKey()

               generateApiKey() takes in parameter of username from the body of the request to create an apiKey for the client and store it in the database

               validateApiKey() takes in a parameter of the apiKey to validate the user.

countries.controller: countryData()
                     getCountry(name)
                     fetchCountryData(
                        @Query('sortBy') sortBy: keyof GetCountryEntity,
                        @Query('order') order: 'ASC' | 'DESC' = 'ASC',
                      )
                      getRegion()
                      getLanguages()
                      getAggregatedStats()

                      countryData() 'Retrieve a list of countries with pagination and optional filtering by region or population size.',

                      getCountry(name) Retrieve detailed information for a specific country, including its languages, population, area, and bordering countries.

                      fetchCountryData() Retrieve saved country data from the database

                      getRegion()  Retrieve a list of regions and the countries within each region, with additional aggregated data such as the total population of the region.

                      getLanguages() Retrieve a list of languages and the countries where they are spoken. Include the total number of speakers globally for each language.

                      getAggregatedStats() Provide aggregated statistics such as the total number of countries, the largest country by area, the smallest by population, and the most widely spoken language.

  
  ## Architecture 

      Github
      ||
      Render Platform
      ||
      Web Service
      ||
      NestJs Api
      ||
      NodeJs
      ||
      PostgreSql
      Database

## Overview of GetCountryRepository
  It contains the implementation of redis caching, 
  
              getCountry endpoint for fetching specified country from the provided api and 
  
              fetchCountryData which fetches data from the database ensuring consistency. Sorting is implemented also.

## Overview of CountryRepository
  it contains : countryData api for fetching countries with respect to criteria of pagination, region and population

              getRegion api for fetching countries with respect to their regions

              getLanguages api for fetching countries with respect to languages being spoken

              getAggregatedStats api for fetching data with respect to aggregation

## Security
  The implenetation of custom authentication to generate an api key which will grant access to the use of this api's

  The implementaion of rate limiting to ensure that dubios acts are curtailed

## Performance 
  The implementation of redis caching in the getCountry() endpoint ensures that performance is optimized

  The structure of the api ensures that concurrency is handled adequately

## Documentaion
  Documentation is done with the use of swagger Api can be visited on     (http://localhost:3002/api)

## logging
  Logging was implemented with the use Logger a library available to nestjs
  For optimization of logging, the use of third party apps like sentry can be employed

## Testing
  implementation of testing was carried out on the getCountry api with the use of jest.


● Highlights of interesting challenges or features.
  Implementing the redis caching 
  implementing the rate limiting
  implementing the aggregated stats

● Aspects you are particularly proud of.
  implementaion of the caching with the use of redis

● Potential improvements or additional features you would add if you
  had more time.
  integration with third party app like sentry for logging and debugging
  centralizing the api call so it's not overly repeated in a utils module.
  centralzing the redis caching so it works with respect to all the endpoints in a utils module