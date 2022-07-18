import { Injectable } from '@angular/core';
import { CountryService } from './country.service';

export interface Fact {
  name: string,
  value: string,
};

// TODO(agale): Populate facts for each country.
const FACTS: {[key: string]: Fact[]} = {
  'Australia': [
    { name: 'Past Appearances', value: '7' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '12' },
    { name: 'Population', value: '25 million' },
  ],
  'Canada': [
    { name: 'Past Appearances', value: '7' },
    { name: 'Best Finish', value: 'Fourth Place' },
    { name: 'FIFA rank', value: '6' },
    { name: 'Population', value: '38 million' },
  ],
  'China PR': [
    { name: 'Past Appearances', value: '7' },
    { name: 'Best Finish', value: 'Runners-up' },
    { name: 'FIFA rank', value: '16' },
    { name: 'Population', value: '1.4 billion' },
  ],
  'Costa Rica': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '37' },
    { name: 'Population', value: '5.0 million' },
  ],
  'Denmark': [
    { name: 'Past Appearances', value: '4' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '15' },
    { name: 'Population', value: '5.8 million' },
  ],
  'France': [
    { name: 'Past Appearances', value: '4' },
    { name: 'Best Finish', value: 'Fourth Place' },
    { name: 'FIFA rank', value: '3' },
    { name: 'Population', value: '67 million' },
  ],
  'Jamaica': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '51' },
    { name: 'Population', value: '2.9 million' },
  ],
  'Japan': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Champions' },
    { name: 'Wins', value: '1' },
    { name: 'FIFA rank', value: '13' },
    { name: 'Population', value: '125 million' },
  ],
  'Morocco': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '77' },
    { name: 'Population', value: '36 million' },
  ],
  'New Zealand': [
    { name: 'Past Appearances', value: '5' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '22' },
    { name: 'Population', value: '5.0 million' },
  ],
  'Nigeria': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Quarter Finals' },
    { name: 'FIFA rank', value: '39' },
    { name: 'Population', value: '206 million' },
  ],
  'Philippines': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '53' },
    { name: 'Population', value: '109 million' },
  ],
  'South Africa': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '58' },
    { name: 'Population', value: '59 million' },
  ],
  'South Korea': [
    { name: 'Past Appearances', value: '3' },
    { name: 'Best Finish', value: 'Round of 16' },
    { name: 'FIFA rank', value: '18' },
    { name: 'Population', value: '51 million' },
  ],
  'Spain': [
    { name: 'Past Appearances', value: '2' },
    { name: 'Best Finish', value: 'Round of 16' },
    { name: 'FIFA rank', value: '7' },
    { name: 'Population', value: '47 million' },
  ],
  'Sweden': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Runners-up' },
    { name: 'FIFA rank', value: '2' },
    { name: 'Population', value: '10 million' },
  ],
  'United States': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Champions' },
    { name: 'Wins', value: '4' },
    { name: 'FIFA rank', value: '1' },
    { name: 'Population', value: '329 million' },
  ],
  'Vietnam': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '32' },
    { name: 'Population', value: '97 million' },
  ],
  'Zambia': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '103' },
    { name: 'Population', value: '18 million' },
  ],
}

@Injectable({
  providedIn: 'root'
})
export class FactService {

  constructor(private readonly countryService: CountryService) { }

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
