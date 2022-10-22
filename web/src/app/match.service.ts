import { Injectable } from '@angular/core';

export type City = 'Adelaide, AU' | 'Auckland, NZ' | 'Brisbane, AU' | 'Dunedin, NZ' | 'Hamilton, NZ' | 'Melbourne, AU' | 'Perth, AU' | 'Sydney, AU' | 'Wellington, NZ';

export interface Match {
  id: number,
  home: string;
  away: string;
  city: City;
  date: Date;
}

const TIMEZONE_MAP: { [key: string]: string } = {
  'Adelaide, AU': 'Australia/Adelaide',
  'Auckland, NZ': 'Pacific/Auckland',
  'Brisbane, AU': 'Australia/Brisbane',
  'Dunedin, NZ': 'Pacific/Auckland',
  'Hamilton, NZ': 'Pacific/Auckland',
  'Melbourne, AU': 'Australia/Melbourne',
  'Perth, AU': 'Australia/Perth',
  'Sydney, AU': 'Australia/Sydney',
  'Wellington, NZ': 'Pacific/Auckland',
};

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private readonly matchMap: { [key: string]: Match };
  private readonly gamesPerDay: { [key: string]: Match[] };

  constructor() {
    this.matchMap = this.getMatches().reduce((map: { [key: string]: Match }, obj: Match) => {
      map[obj.home] = obj;
      map[obj.away] = obj;
      return map;
    }, {});
    this.gamesPerDay = this.getMatches().reduce((prev: { [key: string]: Match[] }, cur) => {
      const date = this.formatDate(cur.date, cur.city, false);
      if (date in prev) {
        prev[date].push(cur);
      } else {
        prev[date] = [cur];
      }
      return prev;
    }, {});
  }

  getCities(country: string): Array<City | City[]> {
    const groupMatches = this.getMatches().filter(m => m.home === country || m.away === country).map(m => m.city);
    const group = country.charAt(0);
    const sixteenMatches = [this.matchMap[`1${group}`], this.matchMap[`2${group}`]];
    const quarterMatches = [this.matchMap[`W${sixteenMatches[0].id}`], this.matchMap[`W${sixteenMatches[1].id}`]];
    const semiMatches = [this.matchMap[`W${quarterMatches[0].id}`], this.matchMap[`W${quarterMatches[1].id}`]];
    return [
      ...groupMatches,
      sixteenMatches.map(m => m.city),
      quarterMatches.map(m => m.city),
      semiMatches.map(m => m.city),
      'Sydney, AU',
    ];
  }

  getAllCities() {
    return ['Adelaide, AU', 'Auckland, NZ', 'Brisbane, AU', 'Dunedin, NZ', 'Hamilton, NZ', 'Melbourne, AU', 'Perth, AU', 'Sydney, AU', 'Wellington, NZ'];
  }

  getGroups() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(i => {
      return {
        name: `Group ${i}`,
        children: [1, 2, 3, 4].map(j => `${i}${j}`),
      };
    });
  }

  // TODO(agale): Add times in local times.
  getMatches(): Match[] {
    return [
      { id: 1, home: 'A1', away: 'A2', city: 'Auckland, NZ', date: new Date(Date.parse('2023/07/20 18:00 GMT+12')) },
      { id: 2, home: 'B1', away: 'B2', city: 'Sydney, AU', date: new Date(Date.parse('2023/07/20 18:00 GMT+10')) },
      { id: 3, home: 'A3', away: 'A4', city: 'Dunedin, NZ', date: new Date(Date.parse('2023/07/21 18:00 GMT+12')) },
      { id: 4, home: 'B3', away: 'B4', city: 'Melbourne, AU', date: new Date(Date.parse('2023/07/21 18:00 GMT+10')) },
      { id: 5, home: 'C1', away: 'C2', city: 'Wellington, NZ', date: new Date(Date.parse('2023/07/21 18:00 GMT+12')) },
      { id: 6, home: 'C3', away: 'C4', city: 'Hamilton, NZ', date: new Date(Date.parse('2023/07/22 18:00 GMT+12')) },
      { id: 7, home: 'D1', away: 'D2', city: 'Brisbane, AU', date: new Date(Date.parse('2023/07/22 18:00 GMT+10')) },
      { id: 8, home: 'D3', away: 'D4', city: 'Perth, AU', date: new Date(Date.parse('2023/07/22 18:00 GMT+8')) },
      { id: 9, home: 'E1', away: 'E2', city: 'Auckland, NZ', date: new Date(Date.parse('2023/07/22 18:00 GMT+12')) },
      { id: 10, home: 'E3', away: 'E4', city: 'Dunedin, NZ', date: new Date(Date.parse('2023/07/23 18:00 GMT+12')) },
      { id: 11, home: 'F1', away: 'F2', city: 'Sydney, AU', date: new Date(Date.parse('2023/07/23 18:00 GMT+10')) },
      { id: 12, home: 'G1', away: 'G2', city: 'Wellington, NZ', date: new Date(Date.parse('2023/07/23 18:00 GMT+12')) },
      { id: 13, home: 'F3', away: 'F4', city: 'Adelaide, AU', date: new Date(Date.parse('2023/07/24 18:00 GMT+9:30')) },
      { id: 14, home: 'G3', away: 'G4', city: 'Auckland, NZ', date: new Date(Date.parse('2023/07/24 18:00 GMT+12')) },
      { id: 15, home: 'H1', away: 'H2', city: 'Melbourne, AU', date: new Date(Date.parse('2023/07/24 18:00 GMT+10')) },
      { id: 16, home: 'H3', away: 'H4', city: 'Sydney, AU', date: new Date(Date.parse('2023/07/25 18:00 GMT+10')) },
      { id: 17, home: 'A1', away: 'A3', city: 'Wellington, NZ', date: new Date(Date.parse('2023/07/25 18:00 GMT+12')) },
      { id: 18, home: 'A4', away: 'A2', city: 'Hamilton, NZ', date: new Date(Date.parse('2023/07/25 18:00 GMT+12')) },
      { id: 19, home: 'B4', away: 'B2', city: 'Perth, AU', date: new Date(Date.parse('2023/07/26 18:00 GMT+8')) },
      { id: 20, home: 'C1', away: 'C3', city: 'Auckland, NZ', date: new Date(Date.parse('2023/07/26 18:00 GMT+12')) },
      { id: 21, home: 'C4', away: 'C2', city: 'Dunedin, NZ', date: new Date(Date.parse('2023/07/26 18:00 GMT+12')) },
      { id: 22, home: 'B1', away: 'B3', city: 'Brisbane, AU', date: new Date(Date.parse('2023/07/27 18:00 GMT+10')) },
      { id: 23, home: 'E1', away: 'E3', city: 'Wellington, NZ', date: new Date(Date.parse('2023/07/27 18:00 GMT+12')) },
      { id: 24, home: 'E4', away: 'E2', city: 'Hamilton, NZ', date: new Date(Date.parse('2023/07/27 18:00 GMT+12')) },
      { id: 25, home: 'D1', away: 'D3', city: 'Sydney, AU', date: new Date(Date.parse('2023/07/28 18:00 GMT+10')) },
      { id: 26, home: 'D4', away: 'D2', city: 'Adelaide, AU', date: new Date(Date.parse('2023/07/28 18:00 GMT+9:30')) },
      { id: 27, home: 'G4', away: 'G2', city: 'Dunedin, NZ', date: new Date(Date.parse('2023/07/28 18:00 GMT+12')) },
      { id: 28, home: 'F1', away: 'F3', city: 'Brisbane, AU', date: new Date(Date.parse('2023/07/29 18:00 GMT+10')) },
      { id: 29, home: 'F4', away: 'F2', city: 'Perth, AU', date: new Date(Date.parse('2023/07/29 18:00 GMT+8')) },
      { id: 30, home: 'G1', away: 'G3', city: 'Wellington, NZ', date: new Date(Date.parse('2023/07/29 18:00 GMT+12')) },
      { id: 31, home: 'H1', away: 'H3', city: 'Sydney, AU', date: new Date(Date.parse('2023/07/30 18:00 GMT+10')) },
      { id: 32, home: 'H4', away: 'H2', city: 'Adelaide, AU', date: new Date(Date.parse('2023/07/30 18:00 GMT+9:30')) },
      { id: 33, home: 'A4', away: 'A1', city: 'Dunedin, NZ', date: new Date(Date.parse('2023/07/30 18:00 GMT+12')) },
      { id: 34, home: 'A2', away: 'A3', city: 'Auckland, NZ', date: new Date(Date.parse('2023/07/30 18:00 GMT+12')) },
      { id: 35, home: 'B4', away: 'B1', city: 'Melbourne, AU', date: new Date(Date.parse('2023/07/31 18:00 GMT+10')) },
      { id: 36, home: 'B2', away: 'B3', city: 'Brisbane, AU', date: new Date(Date.parse('2023/07/31 18:00 GMT+10')) },
      { id: 37, home: 'C4', away: 'C1', city: 'Wellington, NZ', date: new Date(Date.parse('2023/07/31 18:00 GMT+12')) },
      { id: 38, home: 'C2', away: 'C3', city: 'Hamilton, NZ', date: new Date(Date.parse('2023/07/31 18:00 GMT+12')) },
      { id: 39, home: 'D4', away: 'D1', city: 'Adelaide, AU', date: new Date(Date.parse('2023/08/01 18:00 GMT+9:30')) },
      { id: 40, home: 'D2', away: 'D3', city: 'Perth, AU', date: new Date(Date.parse('2023/08/01 18:00 GMT+8')) },
      { id: 41, home: 'E4', away: 'E1', city: 'Auckland, NZ', date: new Date(Date.parse('2023/08/01 18:00 GMT+12')) },
      { id: 42, home: 'E2', away: 'E3', city: 'Dunedin, NZ', date: new Date(Date.parse('2023/08/01 18:00 GMT+12')) },
      { id: 43, home: 'F4', away: 'F1', city: 'Sydney, AU', date: new Date(Date.parse('2023/08/02 18:00 GMT+10')) },
      { id: 44, home: 'F2', away: 'F3', city: 'Melbourne, AU', date: new Date(Date.parse('2023/08/02 18:00 GMT+10')) },
      { id: 45, home: 'G4', away: 'G1', city: 'Hamilton, NZ', date: new Date(Date.parse('2023/08/02 18:00 GMT+12')) },
      { id: 46, home: 'G2', away: 'G3', city: 'Wellington, NZ', date: new Date(Date.parse('2023/08/02 18:00 GMT+12')) },
      { id: 47, home: 'H4', away: 'H1', city: 'Brisbane, AU', date: new Date(Date.parse('2023/08/03 18:00 GMT+10')) },
      { id: 48, home: 'H2', away: 'H3', city: 'Perth, AU', date: new Date(Date.parse('2023/08/03 18:00 GMT+8')) },
      { id: 49, home: '1A', away: '2C', city: 'Auckland, NZ', date: new Date(Date.parse('2023/08/05 18:00 GMT+12')) },
      { id: 50, home: '1C', away: '2A', city: 'Wellington, NZ', date: new Date(Date.parse('2023/08/05 18:00 GMT+12')) },
      { id: 51, home: '1E', away: '2G', city: 'Sydney, AU', date: new Date(Date.parse('2023/08/06 18:00 GMT+10')) },
      { id: 52, home: '1G', away: '2E', city: 'Melbourne, AU', date: new Date(Date.parse('2023/08/06 18:00 GMT+10')) },
      { id: 53, home: '1B', away: '2D', city: 'Sydney, AU', date: new Date(Date.parse('2023/08/07 18:00 GMT+10')) },
      { id: 54, home: '1D', away: '2B', city: 'Brisbane, AU', date: new Date(Date.parse('2023/08/07 18:00 GMT+10')) },
      { id: 55, home: '1F', away: '2H', city: 'Adelaide, AU', date: new Date(Date.parse('2023/08/08 18:00 GMT+9:30')) },
      { id: 56, home: '1H', away: '2F', city: 'Melbourne, AU', date: new Date(Date.parse('2023/08/08 18:00 GMT+10')) },
      { id: 57, home: 'W49', away: 'W51', city: 'Wellington, NZ', date: new Date(Date.parse('2023/08/11 18:00 GMT+12')) },
      { id: 58, home: 'W50', away: 'W52', city: 'Auckland, NZ', date: new Date(Date.parse('2023/08/11 18:00 GMT+12')) },
      { id: 59, home: 'W53', away: 'W55', city: 'Brisbane, AU', date: new Date(Date.parse('2023/08/12 18:00 GMT+10')) },
      { id: 60, home: 'W54', away: 'W56', city: 'Sydney, AU', date: new Date(Date.parse('2023/08/12 18:00 GMT+10')) },
      { id: 61, home: 'W57', away: 'W58', city: 'Auckland, NZ', date: new Date(Date.parse('2023/08/15 18:00 GMT+12')) },
      { id: 62, home: 'W59', away: 'W60', city: 'Sydney, AU', date: new Date(Date.parse('2023/08/16 18:00 GMT+10')) },
      { id: 63, home: 'L61', away: 'L62', city: 'Brisbane, AU', date: new Date(Date.parse('2023/08/19 18:00 GMT+10')) },
      { id: 64, home: 'W61', away: 'W62', city: 'Sydney, AU', date: new Date(Date.parse('2023/08/20 18:00 GMT+10')) },
    ];
  }

  getGamesPerDay() {
    return this.gamesPerDay;
  }

  formatDate(date: Date, city: string, include_time = true) {
    return date.toLocaleString(undefined, {
      timeZone: TIMEZONE_MAP[city],
      dateStyle: 'medium',
      timeStyle: include_time ? 'short' : undefined
    });
  }
}
