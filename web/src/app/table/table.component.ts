import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { CITY_TITLE } from '../country.service';
import { Match, MatchService } from '../match.service';

interface Projection {
  country: string;
  position: number;
}

// TODO(agale): Flip this value if game times are available.
export const RENDER_TIMES = false;

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

  @Input()
  showCheckboxes = true;

  @ViewChildren("checkbox") checkboxes?: QueryList<ElementRef<HTMLInputElement>>;

  @Output() selected: EventEmitter<number[]> = new EventEmitter();

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

  handleCheckbox(event: Event) {
    (this.checkboxes || []).forEach(checkbox => {
      checkbox.nativeElement.checked = (<HTMLInputElement>event.target).checked;
    });
    this.emitSelected();
  }

  emitSelected() {
    const selected = (this.checkboxes || [])
      .filter(checkbox => checkbox.nativeElement.checked)
      .map(checkbox => parseInt(checkbox.nativeElement.value));
    this.selected.emit(selected);
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
    if (!RENDER_TIMES) {
      return this.matchService.formatDate(date, city, false);
    }

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
