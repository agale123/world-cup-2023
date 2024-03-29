import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CITIES, CountryService, FLAGS } from '../country.service';
import { City, Match, MatchService } from '../match.service';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

declare var $: any;

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

  cityPreferences: string[] = [];

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

  updateCityPreferences() {
    this.cityPreferences = [...this.city?.nativeElement.options]
      .filter((opt: HTMLOptionElement) => opt.selected)
      .map((opt: HTMLOptionElement) => opt.value);
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
      const padding = 20;
      const width = document.getElementsByClassName("map")[0].clientWidth;

      let svg = d3.select('.map').append('svg')
        .attr('width', width)
        .attr('height', height);
      this.g = svg.append('g');

      // Render country outlines
      this.projection = d3.geoMercator().fitExtent([[padding / 2, padding / 2], [width - padding / 2, height - padding / 2]], outlines);
      let path = d3.geoPath().projection(this.projection)
        ;
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

  private preferenceMap: { [key: string]: number } = {};

  generateItinerary() {
    // Read inputs from the form
    this.preferenceMap = this.countryPreferences.reduce((map: { [key: string]: number }, obj) => {
      map[obj.country] = obj.weight;
      return map
    }, {});

    // Generate itinerary
    let prev = Object.keys(CITIES).map(city => ({ city, score: 0, path: [city] }));
    let prevWithHop = Object.keys(CITIES).map(city => ({ city, score: 0, path: [city] }));
    let next: Array<{ city: string, score: number, path: string[] }> = [];
    let nextWithHop: Array<{ city: string, score: number, path: string[] }> = [];
    const date = new Date(GROUP_START);
    // Greedy algorithm that builds up a schedule by iterating over dates.
    while (date <= new Date(GROUP_END)) {
      // Get string representation of the date.
      const dateKey = date.toLocaleString(undefined, { dateStyle: 'medium', timeZone: 'GMT+0' });
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - 1);
      const prevDateKey = prevDate.toLocaleString(undefined, { dateStyle: 'medium', timeZone: 'GMT+0' });

      // Consider each possible city you could go to on the date.
      for (const city of Object.keys(CITIES)) {
        // Figure out which previous city gives the lowest cost.
        // Consider regular paths with no free hops across the ocean.
        let value = Number.NEGATIVE_INFINITY;
        let path: string[] = [];
        for (const node of prev) {
          const newValue = node.score + this.cost(prevDateKey, node.city, city);
          if (newValue > value) {
            value = newValue;
            path = [...node.path];
          }
        }

        // Consider regular paths after a free hop.
        let valueWithHop = Number.NEGATIVE_INFINITY;
        let pathWithHop: string[] = [];
        for (const node of prevWithHop) {
          const newValue = node.score + this.cost(prevDateKey, node.city, city);
          if (newValue > valueWithHop) {
            valueWithHop = newValue;
            pathWithHop = [...node.path];
          }
        }
        // And paths that get one free hop.
        for (const node of prev) {
          if (node.score > valueWithHop) {
            valueWithHop = node.score;
            pathWithHop = [...node.path];
          }
        }
        // Add the reward.
        value += this.reward(dateKey, city);
        path.push(city);
        next.push({ city, path, score: value });
        valueWithHop += this.reward(dateKey, city);
        pathWithHop.push(city);
        nextWithHop.push({ city, path: pathWithHop, score: valueWithHop });
      }

      prev = next;
      prevWithHop = nextWithHop;
      next = [];
      nextWithHop = [];
      date.setDate(date.getDate() + 1);
    }
    // Select the end city that has the highest associated score.
    const optimal = prevWithHop.reduce((prev, curr) => {
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

  cost(prevDate: string, from: string, to: string) {
    // When there is a game in the previous city on the previous day, increase the cost.
    const matches = (this.matchService.getGamesPerDay()[prevDate] || []).filter(m => m.city === from);
    const scale = matches.length > 0 ? SEQUENTIAL_MULTIPLIER : 1;
    return scale * DISTANCE_MULTIPLIER * Math.pow(calcDistance(from as City, to as City), DISTANCE_POWER);
  }

  reward(date: string, city: string) {
    const matches = this.matchService.getGamesPerDay()[date].filter(m => m.city === city);
    if (matches.length > 0) {
      const teamReward = Math.max(
        (this.preferenceMap[matches[0].home] || 0) + (this.preferenceMap[matches[0].away] || 0),
        DEFAULT_WEIGHT);
      const cityReward = this.cityPreferences.includes(matches[0].city) ? CITY_WEIGHT : 0;
      return (teamReward / Math.max(this.countryPreferences.length, 1)) + (cityReward / Math.max(this.cityPreferences.length, 1));
    }
    return 0;
  }
}

const DEFAULT_WEIGHT = 0.2;
const CITY_WEIGHT = 1.3;
const DISTANCE_POWER = 0.6;
const DISTANCE_MULTIPLIER = -0.015;
const SEQUENTIAL_MULTIPLIER = 1.6;

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