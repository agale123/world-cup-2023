import { Injectable } from '@angular/core';
import { CountryService } from './country.service';

export interface Fact {
  name: string,
  value: string,
};

const FACTS: {[key: string]: Fact[]} = {
  'Australia': [
    { name: 'Appearances', value: '9' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '12' },
    { name: 'Population', value: '25 million' },
  ],
  'New Zealand': [
    { name: 'Appearances', value: '7' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '22' },
    { name: 'Population', value: '5 million' },
  ],
}

@Injectable({
  providedIn: 'root'
})
export class FactService {

  constructor(private readonly countryService: CountryService) { }

  // TODO(agale): Populate facts for each country. Ideas include: number of past
  // tournaments, best finish, wins, FIFA rank, population.
  getFacts(country: string): Fact[] {
    const formattedCountry = this.countryService.formatCountry(country);
    if (formattedCountry in FACTS) {
      return FACTS[formattedCountry];
    }
    return [
      { name: 'Population', value: 'x' },
      { name: 'Wins', value: 'x' },
    ]
  }
}
