import { Injectable } from '@angular/core';

export type City = 'Adelaide' | 'Auckland' | 'Brisbane' | 'Dunedin' | 'Hamilton' | 'Melbourne' | 'Perth' | 'Sydney' | 'Wellington';

export interface Match {
  id: number,
  home: string;
  away: string;
  city: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor() { }

  // TODO(agale): Get cities for all countries.
  getCities(country: string): Array<City | City[]> {
    return [
      'Hamilton',
      'Dunedin',
      'Sydney',
      ['Auckland', 'Hamilton'],
      ['Dunedin', 'Perth'],
      ['Brisbane', 'Melbourne'],
      'Sydney',
    ];
  }

  getAllCities() {
    return ['Adelaide', 'Auckland', 'Brisbane', 'Dunedin', 'Hamilton', 'Melbourne', 'Perth', 'Sydney', 'Wellington'];
  }

  getGroups() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(i => {
      return {
        name: `Group ${i}`,
        children: [1, 2, 3, 4].map(j => `${i}${j}`),
      };
    });
  }

  // TODO(agale): Implement this.
  getMatches() {
    return [
      {
        id: 1,
        home: 'A1',
        away: 'A4',
        city: 'Sydney',
        date: new Date(),
      },
      {
        id: 2,
        home: 'A2',
        away: 'A3',
        city: 'Auckland',
        date: new Date(),
      },
      {
        id: 3,
        home: 'A1',
        away: 'A3',
        city: 'Sydney',
        date: new Date(),
      },
      {
        id: 4,
        home: '1A',
        away: '2B',
        city: 'Dunedin',
        date: new Date(),
      },
      {
        id: 5,
        home: '1B',
        away: '2A',
        city: 'Sydney',
        date: new Date(),
      },
      {
        id: 6,
        home: 'W4',
        away: 'W5',
        city: 'Sydney',
        date: new Date(),
      },
      {
        id: 7,
        home: 'L4',
        away: 'L5',
        city: 'Melbourne',
        date: new Date(),
      },
    ];
  }
}
