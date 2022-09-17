import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CITIES, CountryService, FLAGS } from '../country.service';
import { City, Match, MatchService } from '../match.service';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

declare var $: any;
declare var optimjs: any;

const BLUE = '#0099FF';
const GREEN = '#009645';

const ONE_DAY = 1000 * 60 * 60 * 24;

// 6:00 AM in Auckland on opening day
const FIRST_DAY = Date.parse('2023-07-20 6:00 GMT+12');
const GROUP_START = Date.parse('2023-07-20');
const GROUP_END = Date.parse('2023-08-03');

interface CountryPreference {
  country: string;
  weight: number;
}

interface CityPreference {
  city: string;
  weight: number;
}

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css'],
})
export class ItineraryComponent implements OnInit, AfterViewInit {

  @ViewChild('country') country?: ElementRef;
  @ViewChild('weight') weight?: ElementRef;
  @ViewChild('city') city?: ElementRef;
  @ViewChild('weight2') weight2?: ElementRef;
  @ViewChild('travel') travel?: ElementRef;

  readonly groups = this.matchService.getGroups();
  readonly cities = this.matchService.getAllCities();

  matches: Match[] | null = null;

  countryPreferences: CountryPreference[] = [];

  cityPreferences: CityPreference[] = [];

  constructor(readonly countryService: CountryService,
    private readonly matchService: MatchService,
    private readonly router: Router,
    titleService: Title) {
    titleService.setTitle('World Cup Explorer - Itinerary');
  }

  ngAfterViewInit(): void {
    $('.selectpicker').selectpicker();
  }

  copyLink() {
    if (!this.matches) {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('matchIds', this.matches.map(map => map.id).join(','));
    url.pathname = '/schedule';
    navigator.clipboard.writeText(url.toString());
  }

  removePreference(preference: CountryPreference) {
    this.countryPreferences = this.countryPreferences
      .filter(p => p.country !== preference.country);
  }

  addPreference() {
    const country = this.country?.nativeElement.value;
    const weight = parseInt(this.weight?.nativeElement.value);
    this.removePreference({ country, weight });
    this.countryPreferences.push({ country, weight });
  }

  removeCityPreference(preference: CityPreference) {
    this.cityPreferences = this.cityPreferences
      .filter(p => p.city !== preference.city);
  }

  addCityPreference() {
    const city = this.city?.nativeElement.value;
    const weight = parseInt(this.weight2?.nativeElement.value);
    this.removeCityPreference({ city, weight });
    this.cityPreferences.push({ city, weight });
  }

  getCities() {
    return Object.entries((this.matches || []).reduce(
      (acc: { [key: string]: number }, o: Match) => {
        acc[o.city] = (acc[o.city] || 0) + 1
        return acc;
      }, {}))
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => `${city} (${count})`)
      .join(', ');
  }

  getCountries() {
    return Object.entries((this.matches || []).reduce(
      (acc: { [key: string]: number }, o: Match) => {
        acc[o.home] = (acc[o.home] || 0) + 1;
        acc[o.away] = (acc[o.away] || 0) + 1;
        return acc;
      }, {}))
      .sort((a, b) => b[1] - a[1])
      .map(([country, count]) => `${country} (${count})`)
      .join(', ');
  }

  getDistance() {
    if (!this.matches) {
      return 0;
    }
    let dist = 0;
    for (let i = 0; i < this.matches.length - 1; i++) {
      dist += calcDistance(this.matches[i].city, this.matches[i + 1].city);
    }
    return Math.round(dist);
  }

  private g: any;
  private projection: any;

  ngOnInit(): void {

  }

  mapDrawn = false;

  private drawMap() {
    return d3.json('../assets/map.geojson').then((outlines: any) => {
      const height = 200;
      const width = document.getElementsByClassName("map")[0].clientWidth;

      let svg = d3.select('.map').append('svg')
        .attr('width', width)
        .attr('height', height);
      this.g = svg.append('g');

      // Render country outlines
      this.projection = d3.geoMercator().fitSize([width, height], outlines);
      let path = d3.geoPath().projection(this.projection);
      this.g.selectAll('path')
        .data(outlines.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke-width', '1')
        .style('stroke', BLUE)
        .style('fill', 'white');

      this.mapDrawn = true;
    });
  }

  private drawCities() {
    // Clear any previous marks
    this.g.selectAll('g.city').remove();

    const counts: { [key: string]: number } = {};
    for (const match of this.matches || []) {
      counts[match.city] = counts[match.city] ? counts[match.city] + 1 : 1;
    }
    let dots = this.g.selectAll('g')
      .data(Object.keys(CITIES))
      .enter()
      .append('g')
      .attr('class', 'city');

    dots.append('circle')
      .attr('cx', (d: City) => this.projection(CITIES[d])[0])
      .attr('cy', (d: City) => this.projection(CITIES[d])[1])
      .attr('r', (d: City) => `${counts[d] * 3 || 0}px`)
      .style('fill', GREEN)
      .append("svg:title")
      .text((d: City) => d);
  }

  private readonly matchMap =
    this.matchService.getMatches().reduce((map: { [key: string]: Match }, obj) => {
      const index = Math.round((obj.date.getTime() - FIRST_DAY) / ONE_DAY);
      map[`${index},${obj.city}`] = obj;
      return map;
    }, {});

  private preferenceMap: { [key: string]: number } = {};
  private cityPreferenceMap: { [key: string]: number } = {};

  generateItinerary() {
    // Read inputs from the form
    this.preferenceMap = this.countryPreferences.reduce((map: { [key: string]: number }, obj) => {
      map[obj.country] = obj.weight;
      return map
    }, {});
    this.cityPreferenceMap = this.cityPreferences.reduce((map: { [key: string]: number }, obj) => {
      map[obj.city] = obj.weight;
      return map
    }, {});

    // Generate itinerary
    let prev = Object.keys(CITIES).map(city => ({ city, score: 0, path: [city] }));
    let next: Array<{ city: string, score: number, path: string[] }> = [];
    const date = new Date(GROUP_START);
    while (date <= new Date(GROUP_END)) {
      const dateKey = date.toLocaleString(undefined, { dateStyle: 'medium', timeZone: 'GMT+0' });
      // console.log('******' + dateKey);

      for (const city of Object.keys(CITIES)) {
        let value = Number.NEGATIVE_INFINITY;
        let path: string[] = [];
        for (const node of prev) {
          // console.log(node.city + '->' + city + ' ' + this.cost(node.city, city));
          const newValue = node.score + this.cost(node.city, city);
          if (newValue > value) {
            value = newValue;
            path = [...node.path];
          }
        }
        if (this.reward(dateKey, city) > 0) {
          // console.log(city + ' ' + this.reward(dateKey, city));
        }

        value += this.reward(dateKey, city);
        path.push(city);
        next.push({ city, path, score: value });
      }

      prev = next;
      next = [];
      date.setDate(date.getDate() + 1);
    }
    const optimal = prev.reduce((prev, curr) => {
      return prev.score < curr.score ? curr : prev;
    });

    // Remove the entry for day -1
    optimal.path.shift();

    this.matches = this.matchService.getMatches().filter(m => {
      const index = Math.round((m.date.getTime() - GROUP_START) / ONE_DAY);
      return optimal.path[index] === m.city;
    });

    // Draw the map after the itinerary is generated
    if (this.mapDrawn) {
      this.drawCities();
    } else {
      this.drawMap().then(() => this.drawCities());
    }
  }

  cost(from: string, to: string) {
    return DISTANCE_MULTIPLIER * Math.pow(calcDistance(from as City, to as City), DISTANCE_POWER);
  }

  reward(date: string, city: string) {
    const matches = this.matchService.getGamesPerDay()[date].filter(m => m.city === city);
    if (matches.length > 0) {
      const teamReward = TEAM_REWARD_MULTIPLIER * Math.pow(Math.max(
        (this.preferenceMap[matches[0].home] || 0) + (this.preferenceMap[matches[0].away] || 0),
        DEFAULT_WEIGHT), TEAM_POWER);
      const cityReward = CITY_REWARD_MULTIPLIER * Math.pow(this.cityPreferenceMap[matches[0].city] || 0, CITY_POWER);
      return (teamReward + cityReward) / (this.cityPreferences.length + this.countryPreferences.length);
    }
    return 0;
  }
}

const DEFAULT_WEIGHT = 0.75;
const TEAM_POWER = 1.5;
const CITY_POWER = 0.8;
const DISTANCE_POWER = 0.8;
const TEAM_REWARD_MULTIPLIER = 1;
const CITY_REWARD_MULTIPLIER = 1;
const DISTANCE_MULTIPLIER = -0.01;

function calcDistance(a: City, b: City): number {
  var lat1 = CITIES[a][1];
  var lon1 = CITIES[a][0];
  var lat2 = CITIES[b][1];
  var lon2 = CITIES[b][0];
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var an = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(an)); // 2 * R; R = 6371 km
}