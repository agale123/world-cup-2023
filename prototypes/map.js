// Page dimensions
let width = 900;
let height = 600;

// Colors
let blue = '#0099FF';
let green = '#009645';
let yellow = '#FCC82F';
let red = '#FD5211';

let cities = {
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

let offsets = {
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

let games;
let g;
let projection;

function getCities(id) {
    const groupStage = games
        .filter(game => game.home === id || game.away === id)
        .map(game => game.city);

    const knockoutStage = [
        ['Auckland', 'Hamilton'],
        ['Dunedin', 'Perth'],
        ['Brisbane', 'Melbourne'],
        'Sydney',
    ];
    return [...groupStage, ...knockoutStage];
}

Promise.all([d3.json("data.geojson"), d3.csv("games.csv")]).then(([countries, allGames]) => {
    games = allGames;
    let svg = d3.select("body").append("svg")
        .attr("width", width + 40)
        .attr("height", height);
    g = svg.append("g");

    svg.append("svg:defs")
        .selectAll("marker")
        .data([1, 2])
        .enter()
        .append('svg:marker')
        .attr("id", (d) => `arrow${d}`)
        .attr("viewBox", "0 -4 8 8")
        .attr('refX', 10)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", (d) => d === 1 ? "auto" : "330")
        .attr("fill", green)
        .append("svg:path")
        .attr("d", "M0,-4L8,0L0,4")

    // Render country outlines
    projection = d3.geoMercator().fitSize([width, height], countries);
    let path = d3.geoPath().projection(projection);
    g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke-width", "1")
        .style("stroke", blue)
        .style("fill", "white");

    // Render cities
    let dots = g.selectAll("g")
        .data(Object.keys(cities))
        .enter()
        .append("g")
        .attr("class", "city");

    dots.append('circle')
        .attr("cx", (d) => projection(cities[d])[0])
        .attr("cy", (d) => projection(cities[d])[1])
        .attr("r", "5px")
        .style("fill", yellow);

    // Render city labels
    dots.append("text")
        .attr("x", (d) => projection(cities[d])[0] + offsets[d][0])
        .attr("y", (d) => projection(cities[d])[1] + offsets[d][1])
        .attr("font-family", "Open Sans")
        .text((d) => d);

    // Animate paths
    drawPaths();
});

function drawPaths() {
    // Remove the old path if it exists.
    d3.selectAll("path.line").remove();

    let group = document.getElementById('group').value;
    let position = document.getElementById('position').value;
    let id = `${group}${position}`

    let destinations = getCities(id);

    let index = -1;
    let repeat = () => {
        if (++index >= destinations.length - 1) {
            return;
        }

        let data;
        if (typeof destinations[index] === 'string' && typeof destinations[index + 1] === 'string') {
            data = [{ start: destinations[index], end: destinations[index + 1] }];
        } else {
            data = [
                {
                    start: typeof destinations[index] === 'string' ? destinations[index] : destinations[index][0],
                    end: typeof destinations[index + 1] === 'string' ? destinations[index + 1] : destinations[index + 1][0]
                },
                {
                    start: typeof destinations[index] === 'string' ? destinations[index] : destinations[index][1],
                    end: typeof destinations[index + 1] === 'string' ? destinations[index + 1] : destinations[index + 1][1]
                },
            ]
        }

        let first = true;
        for (const line of data) {
            let path = g.selectAll("path" + index)
                .data([line])
                .enter()
                .append("path")
                .attr("d", d => {
                    let [x1, y1] = projection(cities[d.start]);
                    let [x2, y2] = projection(cities[d.end]);
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
                .attr("stroke-width", 3)
                .attr("stroke", green)
                .attr("opacity", 0.5 + (index / destinations.length) * 0.5)
                .style("fill", "none")
                .attr("class", "line");

            let totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end", () => {
                    if (line.start === line.end) {
                        path.attr("marker-end", "url(#arrow2)");
                    } else {
                        path.attr("marker-end", "url(#arrow1)");
                    }

                    if (first) {
                        first = false;
                        repeat();
                    }
                });
        }

        // Bring the city dots in front of the lines.
        d3.selectAll('.city').raise();
    };
    repeat();
}