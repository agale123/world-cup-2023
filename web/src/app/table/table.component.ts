import { Component, Input, OnInit } from '@angular/core';
import { CITY_TITLE } from '../country.service';
import { Match, MatchService } from '../match.service';

interface Projection {
  country: string;
  position: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  @Input()
  matches: Match[] = [];

  @Input()
  projected: Projection[] = [];

  @Input()
  timezone: string = 'local';

  titles = CITY_TITLE;

  readonly formatMatchMap: { [key: string]: string[] } = {};

  constructor(private readonly matchService: MatchService) { 
    const sortedMatches = this.matchService.getMatches().sort((a, b) => a.id - b.id);
    const matchesMap: { [key: number]: string[] } = {};
    for (const match of sortedMatches) {
      if (match.home.charAt(0) === '1' || match.home.charAt(0) === '2') {
        matchesMap[match.id] = [match.home, match.away];
        this.formatMatchMap[match.home] = [match.home];
        this.formatMatchMap[match.away] = [match.away];
      } else if (match.home.charAt(0) === 'W') {
        const home = parseInt(match.home.slice(1));
        const away = parseInt(match.away.slice(1));
        matchesMap[match.id] = [...matchesMap[home], ...matchesMap[away]];
        this.formatMatchMap[match.home] = matchesMap[home];
        this.formatMatchMap[match.away] = matchesMap[away];
      }
    }
  }

  ngOnInit(): void {
  }

  getMatchedProjections(country: string) {
    if (country in this.formatMatchMap) {
      const matched = this.formatMatchMap[country];
      const matchedProjections =
        this.projected.filter(p => {
          return matched.includes(`${p.position}${p.country.charAt(0)}`);
        });
      if (matchedProjections.length > 0) {
        return matchedProjections.map(p => p.country);
      }
    }
    return [country];
  }

  formatDate(date: Date, city: string) {
    let timeZone;
    if (this.timezone === 'local') {
      return this.matchService.formatDate(date, city);
    } else if (this.timezone === 'computer') {
      timeZone = undefined;
    } else {
      timeZone = this.timezone;
    }
    return date.toLocaleString(undefined, { timeZone, dateStyle: 'medium', timeStyle: 'short' });
  }

  getRound(matchId: number) {
    if (matchId <= 48) {
      return 'Group';
    } else if (matchId <= 56) {
      return 'Round of 16';
    } else if (matchId <= 60) {
      return 'Quarters';
    } else if (matchId <= 62) {
      return 'Semis';
    } else {
      return 'Finals';
    }
  }
}
