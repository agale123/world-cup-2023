import { Component, OnInit } from '@angular/core';
import { CITIES, CountryService } from '../country.service';
import { City, Match, MatchService } from '../match.service';
import * as d3 from 'd3';

const BLUE = '#0099FF';
const GREEN = '#009645';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css'],
})
export class ItineraryComponent implements OnInit {

  matches: Match[] = this.matchService.getMatches().filter(m => m.id <= 8);

  constructor(private readonly countryService: CountryService, private readonly matchService: MatchService) { }

  formatCountry(country: string) {
    return this.countryService.formatCountry(country);
  }

  formatDate(date: Date, city: string) {
    return this.matchService.formatDate(date, city);
  }

  getCities() {
    return Object.entries(this.matches.reduce(
      (acc: { [key: string]: number }, o: Match) => {
        acc[o.city] = (acc[o.city] || 0) + 1
        return acc;
      }, {}))
      .map(([city, count]) => `${city} (${count})`)
      .join(', ');
  }

  getCountries() {
    return Object.entries(this.matches.reduce(
      (acc: { [key: string]: number }, o: Match) => {
        acc[o.home] = (acc[o.home] || 0) + 1;
        acc[o.away] = (acc[o.away] || 0) + 1;
        return acc;
      }, {}))
      .map(([country, count]) => `${country} (${count})`)
      .join(', ');
  }

  getDistance() {
    let dist = 0;
    for (let i = 0; i < this.matches.length - 1; i++) {
      dist += calcDistance(this.matches[i].city, this.matches[i + 1].city);
    }
    return Math.round(dist);
  }

  private g: any;
  private projection: any;

  ngOnInit(): void {
    d3.json('../assets/map.geojson').then((outlines: any) => {
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

      this.drawCities();
    });
  }

  private drawCities() {
    const counts: { [key: string]: number } = {};
    for (const match of this.matches) {
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
      .attr('r', (d: City) => `${counts[d] * 4}px`)
      .style('fill', GREEN)
      .append("svg:title")
      .text((d: City) => d);
  }
}

function calcDistance(a: City, b: City) {
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