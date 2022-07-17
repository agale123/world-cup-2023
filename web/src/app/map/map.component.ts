import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import { CITIES, CountryService } from '../country.service';
import { FactService, Fact } from '../fact.service';
import { City, MatchService } from '../match.service';

declare var $: any;

// Page dimensions
const WIDTH = 800;
const HEIGHT = 500;

// Colors
const BLUE = '#0099FF';
const GREEN = '#009645';
const YELLOW = '#FCC82F';
const RED = '#FD5211';

const OFFSETS = {
  'Adelaide': [-70, 20],
  'Auckland': [10, -10],
  'Brisbane': [15, -5],
  'Dunedin': [10, 10],
  'Hamilton': [10, 15],
  'Melbourne': [0, 35],
  'Perth': [0, -15],
  'Sydney': [15, 10],
  'Wellington': [10, 25],
};

type Path = { start: City, end: City };

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  groups = this.matchService.getGroups();

  facts: Fact[] = [];

  selectedCountry: string | null;

  private g: any;
  private projection: any;

  @ViewChild('country') country?: ElementRef;
  @ViewChild('first') first?: ElementRef;
  @ViewChild('second') second?: ElementRef;

  constructor(private readonly matchService: MatchService,
    private readonly factService: FactService,
    route: ActivatedRoute,
    readonly countryService: CountryService,
    titleService: Title) {
    titleService.setTitle('World Cup Explorer - Map');
    this.selectedCountry = route.snapshot.queryParamMap.get('country');
  }

  ngAfterViewInit(): void {
    $('.selectpicker').selectpicker();
  }

  /** On initialization, draw the map and cities. */
  ngOnInit(): void {
    d3.json('../assets/map.geojson').then((outlines: any) => {
      const width = Math.min(document.getElementsByClassName("map")[0].clientWidth - 100, WIDTH);

      let svg = d3.select('.map').append('svg')
        .attr('width', width + 40)
        .attr('height', HEIGHT);
      this.g = svg.append('g');

      // Add arrow head markers
      svg.append('svg:defs')
        .selectAll('marker')
        .data([1, 2])
        .enter()
        .append('svg:marker')
        .attr('id', (d) => `arrow${d}`)
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 10)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', (d) => d === 1 ? 'auto' : '330')
        .attr('fill', GREEN)
        .append('svg:path')
        .attr('d', 'M0,-4L8,0L0,4')

      // Render country outlines
      this.projection = d3.geoMercator().fitSize([width - 20, HEIGHT], outlines);
      let path = d3.geoPath().projection(this.projection);
      this.g.selectAll('path')
        .data(outlines.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('stroke-width', '1')
        .style('stroke', BLUE)
        .style('fill', 'white');

      // Render cities
      let dots = this.g.selectAll('g')
        .data(Object.keys(CITIES))
        .enter()
        .append('g')
        .attr('class', 'city');

      dots.append('circle')
        .attr('cx', (d: City) => this.projection(CITIES[d])[0])
        .attr('cy', (d: City) => this.projection(CITIES[d])[1])
        .attr('r', '5px')
        .style('fill', YELLOW);

      // Render city labels
      dots.append('text')
        .attr('x', (d: City) => this.projection(CITIES[d])[0] + OFFSETS[d][0])
        .attr('y', (d: City) => this.projection(CITIES[d])[1] + OFFSETS[d][1])
        .text((d: City) => d);

      this.drawPaths();
    });
  }

  /** Render the path for a specific team. */
  drawPaths() {
    // Remove the old path if it exists.
    d3.selectAll('path.line').interrupt().remove();

    // Get data for the selected country.
    const country = this.country?.nativeElement.value;
    let dests = this.matchService.getCities(country);
    this.facts = this.factService.getFacts(country);

    let index = -1;
    // This function repeats for each segment in the path to animate the line.
    let repeat = () => {
      if (++index >= dests.length - 1) {
        return;
      }

      // Reduce the number of playoff paths if needed.
      const first = this.first?.nativeElement.checked;
      const second = this.second?.nativeElement.checked;
      if (!first && !second) {
        dests = dests.slice(0, 3);
      } else if (first && !second) {
        dests = dests.map(dest => isString(dest) ? dest : dest[0] as City);
      } else if (second && !first) {
        dests = dests.map(dest => isString(dest) ? dest : dest[1] as City);
      }

      // Convert list of destinations into pairs of start/end.
      let data: Array<Path>;
      if (isString(dests[index]) && isString(dests[index + 1])) {
        data = [{ start: dests[index], end: dests[index + 1] } as Path];
      } else {
        data = [0, 1].map(i => {
          return {
            start: isString(dests[index]) ? dests[index] : dests[index][i],
            end: isString(dests[index + 1]) ? dests[index + 1] : dests[index + 1][i]
          } as Path;
        });
      }

      for (let i = 0; i < data.length; i++) {
        let path = this.g.selectAll(`path${index}`)
          .data([data[i]])
          .enter()
          .append('path')
          .attr('d', (d: Path) => {
            let [x1, y1] = this.projection(CITIES[d.start]);
            let [x2, y2] = this.projection(CITIES[d.end]);
            let path = d3.path();
            if (d.start === d.end) {
              path.arc(x1, y1 + 15, 15, 3.14 * 3 / 2, 3.14 * 7 / 2)
            } else {
              path.moveTo(x1, y1);
              // Find a curve through a point perpendicular to the center point
              // at a distance of d/6.
              let d = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) * Math.sqrt(10 / 36);
              let theta = Math.atan(1 / 3) + Math.atan(Math.abs((y2 - y1) / (x2 - x1)));
              let x = Math.cos(theta) * d * Math.sign(x2 - x1);
              let y = Math.sin(theta) * d * Math.sign(y2 - y1);
              path.quadraticCurveTo(x1 + x, y1 + y, x2, y2);
            }
            return path;
          })
          .attr('stroke-width', 3)
          .attr('stroke', GREEN)
          .attr('opacity', 0.5 + (index / dests.length) * 0.5)
          .style('fill', 'none')
          .attr('class', 'line');

        let totalLength = path.node().getTotalLength();

        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
            path.attr('marker-end', data[i].start === data[i].end ? 'url(#arrow2)' : 'url(#arrow1)');

            // When the lines split, only call repeat for the first line
            if (i === 0) {
              repeat();
            }
          });
      }

      // Bring the city dots in front of the lines.
      d3.selectAll('.city').raise();
    };
    repeat();
  }
}

function isString(value: any) {
  return typeof value === 'string';
}