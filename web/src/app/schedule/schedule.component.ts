import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CountryService } from '../country.service';
import { City, Match, MatchService } from '../match.service';

declare var $: any;

interface Projection {
  country: string;
  position: number;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements AfterViewInit {

  @ViewChild('countries') countries?: ElementRef;
  @ViewChild('cities') cities?: ElementRef;
  @ViewChild('country') country?: ElementRef;
  @ViewChild('position') position?: ElementRef;
  @ViewChild('timezone') timezone?: ElementRef;

  matches: Match[] = [];

  projected: Projection[] = [];

  readonly allCities = this.matchService.getAllCities();
  readonly groups = this.matchService.getGroups();

  readonly formatMatchMap: { [key: string]: string[] } = {};

  matchIds: number[] | undefined;

  constructor(private readonly matchService: MatchService,
    readonly countryService: CountryService,
    private readonly changeDetector: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    private readonly location: Location) {
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
    activatedRoute.queryParams.pipe(map(params => {
      const ids = params['matchIds'];
      this.matchIds = params['matchIds']
        ? params['matchIds'].split(',').map((i: string) => parseInt(i))
        : undefined;
    })).subscribe();
  }

  clearMatchIds() {
    this.matchIds = undefined;
    this.updateMatches();
    this.location.replaceState("/schedule")
  }

  copyLink() {
    if (!this.matches) {
      return ;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('matchIds', this.matches.map(map => map.id).join(','));
    url.pathname = '/schedule';
    navigator.clipboard.writeText(url.toString());
  }

  addProjection() {
    const country = this.country?.nativeElement.value;
    const position = this.position?.nativeElement.value;
    this.projected = this.projected
      .filter(p => p.country !== country)
      .filter(p => p.position !== position || p.country.charAt(0) !== country.charAt(0));
    this.projected.push({ country, position });
  }

  removeProjection(projection: Projection) {
    this.projected = this.projected
      .filter(p => p.country !== projection.country || p.position !== projection.position);
  }

  private getMatchedProjections(country: string) {
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

  updateMatches() {
    const countries = [...this.countries?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
    const cities = [...this.cities?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
    this.matches = this.matchService.getMatches().filter(match => {
      if (countries.length === 0) {
        return true;
      }
      return countries.some((country: string) => {
        return this.getMatchedProjections(match.away).includes(country)
          || this.getMatchedProjections(match.home).includes(country);
      });
    }).filter(match => {
      if (cities.length === 0) {
        return true;
      }
      return cities.some((city: string) => match.city === city);
    }).filter(match => {
      if (!this.matchIds) {
        return true;
      }
      return this.matchIds.includes(match.id);
    });
    // Need to render the updated matches.
    this.changeDetector.detectChanges();
  }



  formatCountry(country: string) {
    return this.getMatchedProjections(country)
      .map(c => this.countryService.formatCountry(c))
      .join('\n');
  }

  formatDate(date: Date, city: string) {
    const selected = this.timezone?.nativeElement.value;
    let timeZone;
    if (selected === 'local') {
      return this.matchService.formatDate(date, city);
    } else if (selected === 'computer') {
      timeZone = undefined;
    } else {
      timeZone = selected;
    }
    return date.toLocaleString(undefined, { timeZone, dateStyle: 'medium', timeStyle: 'short' });
  }

  ngAfterViewInit(): void {
    this.updateMatches();
    $('.selectpicker').selectpicker();
  }

}
