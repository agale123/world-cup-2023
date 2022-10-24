import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { select } from 'd3';
import { tap, first, map, Observable, Subject, takeUntil } from 'rxjs';
import { CountryService, FLAGS } from '../country.service';
import { City, Match, MatchService } from '../match.service';
import { RENDER_TIMES } from '../table/table.component';

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
export class ScheduleComponent implements AfterViewInit, OnDestroy {

  @ViewChild('countries') countries?: ElementRef;
  @ViewChild('cities') cities?: ElementRef;
  @ViewChild('country') country?: ElementRef;
  @ViewChild('position') position?: ElementRef;
  @ViewChild('timezone') timezone?: ElementRef;

  matches: Match[] = [];

  projected: Projection[] = [];

  matchIds: number[] | undefined;

  selected: number[] = [];

  readonly allCities = this.matchService.getAllCities();
  readonly groups = this.matchService.getGroups();

  readonly formatMatchMap: { [key: string]: string[] } = {};

  readonly renderTimezonePicker = RENDER_TIMES;

  constructor(private readonly matchService: MatchService,
    readonly countryService: CountryService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly activatedRoute: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router,
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

  handleSelected(selected: number[]) {
    this.selected = selected;
  }

  filterToSelected() {
    if (this.selected.length > 0) {
      this.matchIds = [...this.selected];
      this.updateMatches();
    }
  }

  clearMatchIds() {
    this.matchIds = undefined;
    this.updateMatches();
  }

  getURL() {
    const url = new URL(window.location.href);
    const timezone = this.timezone?.nativeElement.value;
    if (timezone) {
      url.searchParams.set('tz', this.timezone?.nativeElement.value);
    }
    const countries = [...this.countries?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
    if (countries.length > 0) {
      url.searchParams.set('tm', JSON.stringify(countries));
    } else {
      url.searchParams.delete('tm');
    }
    const cities = [...this.cities?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
    if (cities.length > 0) {
      url.searchParams.set('cty', JSON.stringify(cities));
    } else {
      url.searchParams.delete('cty');
    }
    if (this.projected.length > 0) {
      url.searchParams.set('prj', JSON.stringify(this.projected));
    } else {
      url.searchParams.delete('prj');
    }
    const matchIds = (this.matchIds || []);
    if (matchIds.length > 0) {
      url.searchParams.set('matchIds', matchIds.join(','));
    } else {
      url.searchParams.delete('matchIds');
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
    }).filter(match => {
      if (!this.matchIds) {
        return true;
      }
      return this.matchIds.includes(match.id);
    });
    // Need to render the updated matches.
    this.changeDetector.detectChanges();

    this.router.navigateByUrl('/schedule' + this.getURL().split('schedule')[1]);
  }

  selectedCountries?: string[];
  isCountrySelected(country: string) {
    return this.selectedCountries?.includes(country);
  }

  selectedCities?: string[];
  isCitySelected(city: string) {
    return this.selectedCities?.includes(city);
  }

  private readonly onDestroy = new Subject<void>();

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  ngAfterViewInit(): void {
    $('.selectpicker').selectpicker();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    Array.prototype.slice.call(tooltipTriggerList, 0)
      .map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    this.activatedRoute.queryParams.pipe(takeUntil(this.onDestroy), map(params => {
      this.matchIds = params['matchIds']
        ? params['matchIds'].split(',').map((i: string) => parseInt(i))
        : undefined;

      if (params['tz']) {
        $('.selectpicker.tz').selectpicker('val', params['tz']);
      }
      this.selectedCountries = params['tm'] ? JSON.parse(params['tm']) : [];
      $('.selectpicker.tm').selectpicker('val', this.selectedCountries);
      this.selectedCities = params['cty'] ? JSON.parse(params['cty']) : [];
      $('.selectpicker.cty').selectpicker('val', this.selectedCities);
      this.projected = params['prj'] ? JSON.parse(params['prj']) : [];
      this.changeDetector.detectChanges();
      $('.selectpicker').selectpicker();
      this.updateMatches();
    })).subscribe();
  }

}
