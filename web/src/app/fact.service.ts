import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import { CountryService } from './country.service';

export interface Fact {
  name: string,
  value: string,
};

const FACTS: { [key: string]: { [key: string]: string } } = {
  'Argentina': {
    past_appearances: '3',
    best_finish: 'Group Stage',
    fifa_rank: '29',
    population: '45 million',
  },
  'Australia': {
    past_appearances: '7',
    best_finish: 'Quarterfinals',
    fifa_rank: '13',
    population: '26 million',
  },
  'Brazil': {
    past_appearances: '8',
    best_finish: 'Runners-up',
    fifa_rank: '9',
    population: '213 million',
  },
  'Canada': {
    past_appearances: '7',
    best_finish: 'Fourth Place',
    fifa_rank: '7',
    population: '38 million',
  },
  'China': {
    past_appearances: '7',
    best_finish: 'Runners-up',
    fifa_rank: '15',
    population: '1.4 billion',
  },
  'Colombia': {
    past_appearances: '2',
    best_finish: 'Round of 16',
    fifa_rank: '27',
    population: '51 million',
  },
  'Costa Rica': {
    past_appearances: '1',
    best_finish: 'Group Stage',
    fifa_rank: '37',
    population: '5.1 million',
  },
  'Denmark': {
    past_appearances: '4',
    best_finish: 'Quarterfinals',
    fifa_rank: '18',
    population: '5.8 million',
  },
  'England': {
    past_appearances: '5',
    best_finish: 'Third place',
    fifa_rank: '4',
    population: '56 million',
  },
  'France': {
    past_appearances: '4',
    best_finish: 'Fourth Place',
    fifa_rank: '5',
    population: '67 million',
  },
  'Germany': {
    past_appearances: '8',
    best_finish: 'Champions',
    wins: '2',
    fifa_rank: '3',
    population: '83 million',
  },
  'Haiti': {
    past_appearances: '0',
    fifa_rank: '55',
    population: '11 million',
  },
  'Ireland': {
    past_appearances: '0',
    fifa_rank: '24',
    population: '5.0 million',
  },
  'Italy': {
    past_appearances: '3',
    best_finish: 'Quarterfinals',
    fifa_rank: '14',
    population: '60 million',
  },
  'Jamaica': {
    past_appearances: '1',
    best_finish: 'Group Stage',
    fifa_rank: '43',

    population: '3.0 million',
  },
  'Japan': {
    past_appearances: '8',
    best_finish: 'Champions',
    wins: '1',
    fifa_rank: '11',
    population: '126 million',
  },
  'Morocco': {
    past_appearances: '0',
    fifa_rank: '76',
    population: '37 million',
  },
  'Netherlands': {
    past_appearances: '2',
    best_finish: 'Runners-up',
    fifa_rank: '8',
    population: '17 million',
  },
  'New Zealand': {
    past_appearances: '5',
    best_finish: 'Group Stage',
    fifa_rank: '22',
    population: '5.1 million',
  },
  'Nigeria': {
    past_appearances: '8',
    best_finish: 'Quarterfinals',
    fifa_rank: '45',
    population: '206 million',
  },
  'Norway': {
    past_appearances: '8',
    best_finish: 'Champions',
    wins: '1',
    fifa_rank: '12',
    population: '5.4 million',
  },
  'Panama': {
    past_appearances: '0',
    fifa_rank: '57',
    population: '4.4 million',
  },
  'Philippines': {
    past_appearances: '0',
    fifa_rank: '53',
    population: '110 million',
  },
  'Portugal': {
    past_appearances: '0',
    fifa_rank: '22',
    population: '10 million',
  },
  'South Africa': {
    past_appearances: '1',
    best_finish: 'Group Stage',
    fifa_rank: '54',
    population: '59 million',
  },
  'South Korea': {
    past_appearances: '3',
    best_finish: 'Round of 16',
    fifa_rank: '17',
    population: '52 million',
  },
  'Spain': {
    past_appearances: '2',
    best_finish: 'Round of 16',
    fifa_rank: '6',
    population: '47 million',
  },
  'Sweden': {
    past_appearances: '8',
    best_finish: 'Runners-up',
    fifa_rank: '2',
    population: '10 million',
  },
  'Switzerland': {
    past_appearances: '1',
    best_finish: 'Round of 16',
    fifa_rank: '21',
    population: '8.6 million',
  },
  'United States': {
    past_appearances: '8',
    best_finish: 'Champions',
    wins: '4',
    fifa_rank: '1',
    population: '330 million',
  },
  'Vietnam': {
    past_appearances: '0',
    fifa_rank: '34',
    population: '97 million',
  },
  'Zambia': {
    past_appearances: '0',
    fifa_rank: '81',
    population: '18 million',
  },
};

const FORMATTED_KEYS = {
  'past_appearances': 'Past Appearances',
  'best_finish': 'Best Finish',
  'wins': 'Wins',
  'fifa_rank': 'FIFA Rank',
  'population': 'Population',
};

@Injectable({
  providedIn: 'root'
})
export class FactService {

  constructor(private readonly countryService: CountryService) { }

  getFacts(country: string): Fact[] {
    const formattedCountry = this.countryService.formatCountry(country);
    if (formattedCountry in FACTS) {
      const metadata = FACTS[formattedCountry];
      const facts = []

      for (const [key, value] of Object.entries(FORMATTED_KEYS)) {
        if (key in metadata) {
          facts.push({name: value, value: metadata[key]});
        }
      }
      
      return facts;
    }
    return [];
  }
}
