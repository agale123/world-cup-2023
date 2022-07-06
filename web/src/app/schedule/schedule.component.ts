import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CountryService } from '../country.service';
import { Match, MatchService } from '../match.service';

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

  matches: Match[] = [];

  projected: Projection[] = [];

  readonly allCities = this.matchService.getAllCities();
  readonly groups = this.matchService.getGroups();

  readonly formatMatchMap: { [key: string]: string[] } = {};

  constructor(private readonly matchService: MatchService,
    readonly countryService: CountryService,
    private readonly changeDetector: ChangeDetectorRef) {
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
    console.log(this.formatMatchMap);
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
      return countries.some((country: string) => match.away.includes(country) || match.home.includes(country));
    }).filter(match => {
      if (cities.length === 0) {
        return true;
      }
      return cities.some((city: string) => match.city === city);
    });
    // Need to render the updated matches.
    this.changeDetector.detectChanges();
  }

  formatCountry(country: string) {
    console.log(country);
    if (country in this.formatMatchMap) {
      const matched = this.formatMatchMap[country];
      const matchedProjections =
        this.projected.filter(p => {
          return matched.includes(`${p.position}${p.country.charAt(0)}`);
        });
      console.log(matchedProjections);
      if (matchedProjections.length > 0) {
        return matchedProjections.map(p => this.countryService.formatCountry(p.country)).join('\n');
      }
    }
    return this.countryService.formatCountry(country);
  }

  ngAfterViewInit(): void {
    this.updateMatches();
    $('.selectpicker').selectpicker();
  }

}
