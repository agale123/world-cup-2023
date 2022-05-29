let width = 900;
let height = 600;

let cities = {
    'Adelaide': [138.6007, -34.9285],
    'Auckland': [174.7645, -36.8509],
    'Brisbane': [153.0260, -27.4705],
    'Dunedin': [170.5006, -45.8795],
    'Hamilton': [175.2528, -37.7826],
    'Melbourne': [144.9631, -37.8136],
    'Perth': [115.8613, -31.9523],
    'Sydney': [151.2093, -33.8688],
    'Wellington': [174.7787, -41.2924],
};

d3.json("data.geojson").then((countries) => {
    let projection = d3.geoMercator()
        .fitSize([width, height], countries);

    let svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    let path = d3.geoPath().projection(projection);
    let g = svg.append("g");

    // Render country outlines
    g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke-width", "1")
        .style("stroke", "black")
        .style("fill", "white");

    // Render cities
    g.selectAll("circle")
        .data(Object.keys(cities))
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("cx", function (d) { return projection(cities[d])[0]; })
        .attr("cy", function (d) { return projection(cities[d])[1]; })
        .attr("r", "5px")
        .style("fill", "blue");

    // Animate paths
    let destinations = ["Melbourne", "Auckland", "Perth"];
    let index = 0;

    let repeat = () => {
        if (index > destinations.length - 1) {
            return;
        }

        let path = g.selectAll("path" + index)
            .data([{ start: destinations[index], end: destinations[index + 1] }])
            .enter()
            .append("path")
            .attr("d", d => {
                const p = d3.path();
                let x1 = projection(cities[d.start])[0];
                let y1 = projection(cities[d.start])[1];
                let x2 = projection(cities[d.end])[0];
                let y2 = projection(cities[d.end])[1];
                p.moveTo(x1, y1);
                // TODO(agale): Update control point
                p.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 - 80, x2, y2);
                return p;
            })
            .attr("stroke-width", 1)
            .attr("stroke", "black")
            .style("fill", "none");

        let totalLength = path.node().getTotalLength();

        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .on("end", repeat);

        index += 1;
    };
    repeat();
});