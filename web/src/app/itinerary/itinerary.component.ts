import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CITIES, CountryService } from '../country.service';
import { City, Match, MatchService } from '../match.service';
import * as d3 from 'd3';

declare var $: any;
declare var optimjs: any;

const BLUE = '#0099FF';
const GREEN = '#009645';

const ONE_DAY = 1000 * 60 * 60 * 24;

interface Preference {
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
  @ViewChild('travel') travel?: ElementRef;

  readonly groups = this.matchService.getGroups();
  private readonly cities = this.matchService.getAllCities();

  matches: Match[] | null = null;

  preferences: Preference[] = [];

  constructor(readonly countryService: CountryService,
    private readonly matchService: MatchService) { }

  ngAfterViewInit(): void {
    $('.selectpicker').selectpicker();
  }

  removePreference(preference: Preference) {
    this.preferences = this.preferences
      .filter(p => p.country !== preference.country);
  }

  addPreference() {
    const country = this.country?.nativeElement.value;
    const weight = this.weight?.nativeElement.value;
    this.removePreference({ country, weight });
    this.preferences.push({ country, weight });
  }

  formatCountry(country: string) {
    return this.countryService.formatCountry(country);
  }

  formatDate(date: Date, city: string) {
    return this.matchService.formatDate(date, city);
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
      const index = Math.round((obj.date.getTime() - Date.UTC(2023, 6, 20)) / ONE_DAY);
      map[`${index},${obj.city}`] = obj;
      return map;
    }, {});

  private preferenceMap: { [key: string]: number } = {};

  generateItinerary() {
    const travel = this.travel?.nativeElement.value;
    this.preferenceMap = this.preferences.reduce((map: { [key: string]: number }, obj) => {
      map[obj.country] = obj.weight;
      return map
    }, {});

    // Generate itinerary
    //this.matches = this.matchService.getMatches().filter(m => m.id <= 8);

    // There are 15 days of group stage games and each can be a city or null.
    const dims = Array(15).fill(optimjs.Categorical([...this.cities, null]));

    // Powell method can be applied to zero order unconstrained optimization
    let solution = optimjs.rs_minimize(this.score.bind(this), dims, 2640);
    console.log(solution);

    this.matches = this.matchService.getMatches().filter(m => {
      const index = Math.round((m.date.getTime() - Date.UTC(2023, 6, 20)) / ONE_DAY);
      console.log(`${index} ${solution.best_x[index]} ${m.id} ${m.city}`)
      return solution.best_x[index] === m.city;
    });

    // Draw the map after the itinerary is generated
    if (this.mapDrawn) {
      this.drawCities();
    } else {
      this.drawMap().then(() => this.drawCities());
    }
  }

  score(v: Array<City | null>) {
    let result = 0.0;
    // City for the previous day
    let prev = null;
    // The most recent non-null city (if it exists)
    let prevNonNull = null;
    for (let i = 0; i < v.length; i++) {
      // Calculate cost
      let distanceMultiplier = 1.0;
      const distance = prevNonNull && v[i] !== null ? calcDistance(prevNonNull as City, v[i] as City) : 0;
      if (v[i] !== null) {
        prevNonNull = v[i];
      }
      if (i > 0) {
        const prev = v[i - 1];
        if (prev !== null && v[i] !== null && distance > DISTANCE_CUTOFF) {
          distanceMultiplier = 3.0;
        }
      }
      result += Math.pow(distance * distanceMultiplier, 0.5);

      // Calculate reward
      if (v[i] !== null) {
        const match = this.matchMap[`${i},${v[i]}`];
        // Add weights from home & away teams, and default to 0.5 if there is no team preference
        if (match) {
          const weight = Math.max(
            (this.preferenceMap[match.home] || 0) + (this.preferenceMap[match.away] || 0),
            DEFAULT_WEIGHT);
          result -= weight * REWARD_MULTIPLIER / this.preferences.length;
        }
      }
    }
    return result;
  }
}

const DEFAULT_WEIGHT = 0.25;
const REWARD_MULTIPLIER = 100;
const DISTANCE_CUTOFF = 1000;

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