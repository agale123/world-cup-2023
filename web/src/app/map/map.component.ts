import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { City, MatchService } from '../match.service';

// Page dimensions
const WIDTH = 800;
const HEIGHT = 500;

// Colors
const BLUE = '#0099FF';
const GREEN = '#009645';
const YELLOW = '#FCC82F';
const RED = '#FD5211';

const CITIES = {
  'Adelaide': [138.6007, -34.9285],
  'Auckland': [174.6645, -36.7509],
  'Brisbane': [153.0260, -27.4705],
  'Dunedin': [170.5006, -45.8795],
  'Hamilton': [175.2528, -37.9826],
  'Melbourne': [144.9631, -37.8136],
  'Perth': [115.8613, -31.9523],
  'Sydney': [151.2093, -33.8688],
  'Wellington': [174.7787, -41.2924],
};

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
export class MapComponent implements OnInit {
  groups = this.matchService.getGroups();

  private g: any;
  private projection: any;

  constructor(private readonly matchService: MatchService) { }

  /** On initialization, draw the map and cities. */
  ngOnInit(): void {
    d3.json('../assets/map.geojson').then((outlines: any) => {
      const width = Math.min(document.getElementsByClassName("map")[0].clientWidth - 40, WIDTH);

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
      this.projection = d3.geoMercator().fitSize([width, HEIGHT], outlines);
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
  private drawPaths() {
    // Remove the old path if it exists.
    d3.selectAll('path.line').remove();

    let dests = this.matchService.getCities();

    let index = -1;
    // This function repeats for each segment in the path to animate the line.
    let repeat = () => {
      if (++index >= dests.length - 1) {
        return;
      }

      let data: Array<Path>;
      if ( dests[index] instanceof String && dests[index + 1] instanceof String) {
        data = [{ start: dests[index], end: dests[index + 1] } as Path];
      } else {
        data = [0, 1].map(i => {
          return {
            start: typeof dests[index] === 'string' ? dests[index] : dests[index][i],
            end: typeof dests[index + 1] === 'string' ? dests[index + 1] : dests[index + 1][i]
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
