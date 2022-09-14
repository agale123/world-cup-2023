import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { select } from 'd3';
import { first, map, Observable } from 'rxjs';
import { CountryService, FLAGS } from '../country.service';
import { City, Match, MatchService } from '../match.service';

declare var $: any;
declare var bootstrap: any;

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

  constructor(private readonly matchService: MatchService,
    readonly countryService: CountryService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    titleService: Title) {
    titleService.setTitle('World Cup Explorer - Schedule');
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

  getURL() {
    const url = new URL(window.location.href);
    const timezone = this.timezone?.nativeElement.value;
    if (timezone && timezone !== 'local') {
      url.searchParams.set('tz', this.timezone?.nativeElement.value);
    }
    const countries = [...this.countries?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
    if (countries.length > 0) {
      url.searchParams.set('tm', JSON.stringify(countries));
    }
    const cities = [...this.cities?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
    if (cities.length > 0) {
      url.searchParams.set('cty', JSON.stringify(cities));
    }
    if (this.projected.length > 0) {
      url.searchParams.set('prj', JSON.stringify(this.projected));
    }
    url.pathname = '/schedule';
    return url.toString();
  }

  copyLink() {
    navigator.clipboard.writeText(this.getURL());
  }

  addProjection() {
    const country = this.country?.nativeElement.value;
    const position = this.position?.nativeElement.value;
    this.projected = this.projected
      .filter(p => p.country !== country)
      .filter(p => p.position !== position || p.country.charAt(0) !== country.charAt(0));
    this.projected.push({ country, position });
    this.updateMatches();
  }

  removeProjection(projection: Projection) {
    this.projected = this.projected
      .filter(p => p.country !== projection.country || p.position !== projection.position);
    this.updateMatches();
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
    });
    // Need to render the updated matches.
    this.changeDetector.detectChanges();

    this.location.replaceState('/schedule' + this.getURL().split('schedule')[1]);
  }

  selectedCountries?: string[];
  isCountrySelected(country: string) {
    return this.selectedCountries?.includes(country);
  }

  selectedCities?: string[];
  isCitySelected(city: string) {
    return this.selectedCities?.includes(city);
  }

  ngAfterViewInit(): void {
    $('.selectpicker').selectpicker();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.prototype.slice.call(tooltipTriggerList, 0)
      .map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    this.activatedRoute.queryParams.pipe(first(), map(params => {
      if (params['tz']) {
        $('.selectpicker.tz').selectpicker('val', params['tz']);
      }
      this.selectedCountries = params['tm'] ? JSON.parse(params['tm']) : [];
      this.selectedCities = params['cty'] ? JSON.parse(params['cty']) : [];
      this.projected = params['prj'] ? JSON.parse(params['prj']) : [];
      this.changeDetector.detectChanges();
      $('.selectpicker').selectpicker();
      this.updateMatches();
    })).subscribe();
  }

}
