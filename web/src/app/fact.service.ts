import { Injectable } from '@angular/core';
import { CountryService } from './country.service';

export interface Fact {
  name: string,
  value: string,
};

const FACTS: {[key: string]: Fact[]} = {
  'Argentina': [
    { name: 'Past Appearances', value: '3' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '31' },
    { name: 'Population', value: '45 million' },
  ],
  'Australia': [
    { name: 'Past Appearances', value: '7' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '12' },
    { name: 'Population', value: '26 million' },
  ],
  'Brazil': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Runners-up' },
    { name: 'FIFA rank', value: '9' },
    { name: 'Population', value: '213 million' },
  ],
  'Canada': [
    { name: 'Past Appearances', value: '7' },
    { name: 'Best Finish', value: 'Fourth Place' },
    { name: 'FIFA rank', value: '7' },
    { name: 'Population', value: '38 million' },
  ],
  'China': [
    { name: 'Past Appearances', value: '7' },
    { name: 'Best Finish', value: 'Runners-up' },
    { name: 'FIFA rank', value: '16' },
    { name: 'Population', value: '1.4 billion' },
  ],
  'Colombia': [
    { name: 'Past Appearances', value: '2' },
    { name: 'Best Finish', value: 'Round of 16' },
    { name: 'FIFA rank', value: '25' },
    { name: 'Population', value: '51 million' },
  ],
  'Costa Rica': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '37' },
    { name: 'Population', value: '5.1 million' },
  ],
  'Denmark': [
    { name: 'Past Appearances', value: '4' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '17' },
    { name: 'Population', value: '5.8 million' },
  ],
  'England': [
    { name: 'Past Appearances', value: '5' },
    { name: 'Best Finish', value: 'Third place' },
    { name: 'FIFA rank', value: '4' },
    { name: 'Population', value: '56 million' },
  ],
  'France': [
    { name: 'Past Appearances', value: '4' },
    { name: 'Best Finish', value: 'Fourth Place' },
    { name: 'FIFA rank', value: '5' },
    { name: 'Population', value: '67 million' },
  ],
  'Germany': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Champions' },
    { name: 'Wins', value: '2'},
    { name: 'FIFA rank', value: '2' },
    { name: 'Population', value: '83 million' },
  ],
  'Ireland': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '26' },
    { name: 'Population', value: '5.0 million' },
  ],
  'Italy': [
    { name: 'Past Appearances', value: '3' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '15' },
    { name: 'Population', value: '60 million' },
  ],
  'Jamaica': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '42' },
    { name: 'Population', value: '3.0 million' },
  ],
  'Japan': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Champions' },
    { name: 'Wins', value: '1' },
    { name: 'FIFA rank', value: '11' },
    { name: 'Population', value: '126 million' },
  ],
  'Morocco': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '76' },
    { name: 'Population', value: '37 million' },
  ],
  'Netherlands': [
    { name: 'Past Appearances', value: '2' },
    { name: 'Best Finish', value: 'Runners-up' },
    { name: 'FIFA rank', value: '6' },
    { name: 'Population', value: '17 million' },
  ],
  'New Zealand': [
    { name: 'Past Appearances', value: '5' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '22' },
    { name: 'Population', value: '5.1 million' },
  ],
  'Nigeria': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Quarterfinals' },
    { name: 'FIFA rank', value: '46' },
    { name: 'Population', value: '206 million' },
  ],
  'Norway': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Champions' },
    { name: 'Wins', value: '1'},
    { name: 'FIFA rank', value: '13' },
    { name: 'Population', value: '5.4 million' },
  ],
  'Philippines': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '53' },
    { name: 'Population', value: '110 million' },
  ],
  'South Africa': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Group Stage' },
    { name: 'FIFA rank', value: '54' },
    { name: 'Population', value: '59 million' },
  ],
  'South Korea': [
    { name: 'Past Appearances', value: '3' },
    { name: 'Best Finish', value: 'Round of 16' },
    { name: 'FIFA rank', value: '18' },
    { name: 'Population', value: '52 million' },
  ],
  'Spain': [
    { name: 'Past Appearances', value: '2' },
    { name: 'Best Finish', value: 'Round of 16' },
    { name: 'FIFA rank', value: '8' },
    { name: 'Population', value: '47 million' },
  ],
  'Sweden': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Runners-up' },
    { name: 'FIFA rank', value: '3' },
    { name: 'Population', value: '10 million' },
  ],
  'Switzerland': [
    { name: 'Past Appearances', value: '1' },
    { name: 'Best Finish', value: 'Round of 16' },
    { name: 'FIFA rank', value: '21' },
    { name: 'Population', value: '8.6 million' },
  ],
  'United States': [
    { name: 'Past Appearances', value: '8' },
    { name: 'Best Finish', value: 'Champions' },
    { name: 'Wins', value: '4' },
    { name: 'FIFA rank', value: '1' },
    { name: 'Population', value: '330 million' },
  ],
  'Vietnam': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '33' },
    { name: 'Population', value: '97 million' },
  ],
  'Zambia': [
    { name: 'Past Appearances', value: '0' },
    { name: 'FIFA rank', value: '80' },
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
    return [];
  }
}
