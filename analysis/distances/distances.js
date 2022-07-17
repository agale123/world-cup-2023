var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var CITIES = {
    'Adelaide, AU': [138.6007, -34.9285],
    'Auckland, NZ': [174.6645, -36.7509],
    'Brisbane, AU': [153.0260, -27.4705],
    'Dunedin, NZ': [170.5006, -45.8795],
    'Hamilton, NZ': [175.2528, -37.9826],
    'Melbourne, AU': [144.9631, -37.8136],
    'Perth, AU': [115.8613, -31.9523],
    'Sydney, AU': [151.2093, -33.8688],
    'Wellington, NZ': [174.7787, -41.2924]
};
var MatchService = /** @class */ (function () {
    function MatchService() {
        this.matchMap = this.getMatches().reduce(function (map, obj) {
            map[obj.home] = obj;
            map[obj.away] = obj;
            return map;
        }, {});
    }
    MatchService.prototype.getCities = function (country) {
        var groupMatches = this.getMatches().filter(function (m) { return m.home === country || m.away === country; }).map(function (m) { return m.city; });
        var group = country.charAt(0);
        var sixteenMatches = [this.matchMap["1" + group], this.matchMap["2" + group]];
        var quarterMatches = [this.matchMap["W" + sixteenMatches[0].id], this.matchMap["W" + sixteenMatches[1].id]];
        var semiMatches = [this.matchMap["W" + quarterMatches[0].id], this.matchMap["W" + quarterMatches[1].id]];
        return __spreadArrays(groupMatches, [
            sixteenMatches.map(function (m) { return m.city; }),
            quarterMatches.map(function (m) { return m.city; }),
            semiMatches.map(function (m) { return m.city; }),
            'Sydney, AU',
        ]);
    };
    MatchService.prototype.getMatches = function () {
        return [
            { id: 1, home: 'A1', away: 'A2', city: 'Auckland, NZ', date: new Date(2023, 6, 20) },
            { id: 2, home: 'B1', away: 'B2', city: 'Sydney, AU', date: new Date(2023, 6, 20) },
            { id: 3, home: 'A3', away: 'A4', city: 'Dunedin, NZ', date: new Date(2023, 6, 21) },
            { id: 4, home: 'B3', away: 'B4', city: 'Melbourne, AU', date: new Date(2023, 6, 21) },
            { id: 5, home: 'C1', away: 'C2', city: 'Wellington, NZ', date: new Date(2023, 6, 21) },
            { id: 6, home: 'E1', away: 'E2', city: 'Auckland, NZ', date: new Date(2023, 6, 22) },
            { id: 7, home: 'C3', away: 'C4', city: 'Hamilton, NZ', date: new Date(2023, 6, 22) },
            { id: 8, home: 'D1', away: 'D2', city: 'Brisbane, AU', date: new Date(2023, 6, 22) },
            { id: 9, home: 'D3', away: 'D4', city: 'Perth, AU', date: new Date(2023, 6, 22) },
            { id: 10, home: 'F1', away: 'F2', city: 'Sydney, AU', date: new Date(2023, 6, 23) },
            { id: 11, home: 'E3', away: 'E4', city: 'Dunedin, NZ', date: new Date(2023, 6, 23) },
            { id: 12, home: 'G1', away: 'G2', city: 'Wellington, NZ', date: new Date(2023, 6, 23) },
            { id: 13, home: 'G3', away: 'G4', city: 'Auckland, NZ', date: new Date(2023, 6, 24) },
            { id: 14, home: 'H1', away: 'H2', city: 'Melbourne, AU', date: new Date(2023, 6, 24) },
            { id: 15, home: 'F3', away: 'F4', city: 'Adelaide, AU', date: new Date(2023, 6, 24) },
            { id: 16, home: 'H3', away: 'H4', city: 'Sydney, AU', date: new Date(2023, 6, 25) },
            { id: 17, home: 'A1', away: 'A3', city: 'Wellington, NZ', date: new Date(2023, 6, 25) },
            { id: 18, home: 'A4', away: 'A2', city: 'Hamilton, NZ', date: new Date(2023, 6, 25) },
            { id: 19, home: 'C1', away: 'C3', city: 'Auckland, NZ', date: new Date(2023, 6, 26) },
            { id: 20, home: 'C4', away: 'C2', city: 'Dunedin, NZ', date: new Date(2023, 6, 26) },
            { id: 21, home: 'B4', away: 'B2', city: 'Perth, AU', date: new Date(2023, 6, 26) },
            { id: 22, home: 'E1', away: 'E3', city: 'Wellington, NZ', date: new Date(2023, 6, 27) },
            { id: 23, home: 'E4', away: 'E2', city: 'Hamilton, NZ', date: new Date(2023, 6, 27) },
            { id: 24, home: 'B1', away: 'B3', city: 'Brisbane, AU', date: new Date(2023, 6, 27) },
            { id: 25, home: 'D1', away: 'D3', city: 'Sydney, AU', date: new Date(2023, 6, 28) },
            { id: 26, home: 'G4', away: 'G2', city: 'Dunedin, NZ', date: new Date(2023, 6, 28) },
            { id: 27, home: 'D4', away: 'D2', city: 'Adelaide, AU', date: new Date(2023, 6, 28) },
            { id: 28, home: 'G1', away: 'G3', city: 'Wellington, NZ', date: new Date(2023, 6, 29) },
            { id: 29, home: 'F1', away: 'F3', city: 'Brisbane, AU', date: new Date(2023, 6, 29) },
            { id: 30, home: 'F4', away: 'F2', city: 'Perth, AU', date: new Date(2023, 6, 29) },
            { id: 31, home: 'A2', away: 'A3', city: 'Auckland, NZ', date: new Date(2023, 6, 30) },
            { id: 32, home: 'H1', away: 'H3', city: 'Sydney, AU', date: new Date(2023, 6, 30) },
            { id: 33, home: 'A4', away: 'A1', city: 'Dunedin, NZ', date: new Date(2023, 6, 30) },
            { id: 34, home: 'H4', away: 'H2', city: 'Adelaide, AU', date: new Date(2023, 6, 30) },
            { id: 35, home: 'B4', away: 'B1', city: 'Melbourne, AU', date: new Date(2023, 6, 31) },
            { id: 36, home: 'C4', away: 'C1', city: 'Wellington, NZ', date: new Date(2023, 6, 31) },
            { id: 37, home: 'C2', away: 'C3', city: 'Hamilton, NZ', date: new Date(2023, 6, 31) },
            { id: 38, home: 'B2', away: 'B3', city: 'Brisbane, AU', date: new Date(2023, 6, 31) },
            { id: 39, home: 'E4', away: 'E1', city: 'Auckland, NZ', date: new Date(2023, 7, 1) },
            { id: 40, home: 'E2', away: 'E3', city: 'Dunedin, NZ', date: new Date(2023, 7, 1) },
            { id: 41, home: 'D2', away: 'D3', city: 'Perth, AU', date: new Date(2023, 7, 1) },
            { id: 42, home: 'D4', away: 'D1', city: 'Adelaide, AU', date: new Date(2023, 7, 1) },
            { id: 43, home: 'F4', away: 'F1', city: 'Sydney, AU', date: new Date(2023, 7, 2) },
            { id: 44, home: 'F2', away: 'F3', city: 'Melbourne, AU', date: new Date(2023, 7, 2) },
            { id: 45, home: 'G2', away: 'G3', city: 'Wellington, NZ', date: new Date(2023, 7, 2) },
            { id: 46, home: 'G4', away: 'G1', city: 'Hamilton, NZ', date: new Date(2023, 7, 2) },
            { id: 47, home: 'H4', away: 'H1', city: 'Brisbane, AU', date: new Date(2023, 7, 3) },
            { id: 48, home: 'H2', away: 'H3', city: 'Perth, AU', date: new Date(2023, 7, 3) },
            { id: 49, home: '1A', away: '2C', city: 'Auckland, NZ', date: new Date(2023, 7, 5) },
            { id: 50, home: '1C', away: '2A', city: 'Wellington, NZ', date: new Date(2023, 7, 5) },
            { id: 51, home: '1E', away: '2G', city: 'Sydney, AU', date: new Date(2023, 7, 6) },
            { id: 52, home: '1G', away: '2E', city: 'Melbourne, AU', date: new Date(2023, 7, 6) },
            { id: 53, home: '1D', away: '2B', city: 'Brisbane, AU', date: new Date(2023, 7, 7) },
            { id: 54, home: '1B', away: '2D', city: 'Sydney, AU', date: new Date(2023, 7, 7) },
            { id: 55, home: '1H', away: '2F', city: 'Melbourne, AU', date: new Date(2023, 7, 8) },
            { id: 56, home: '1F', away: '2H', city: 'Adelaide, AU', date: new Date(2023, 7, 8) },
            { id: 57, home: 'W50', away: 'W52', city: 'Auckland, NZ', date: new Date(2023, 7, 11) },
            { id: 58, home: 'W49', away: 'W51', city: 'Wellington, NZ', date: new Date(2023, 7, 11) },
            { id: 59, home: 'W54', away: 'W56', city: 'Brisbane, AU', date: new Date(2023, 7, 12) },
            { id: 60, home: 'W53', away: 'W55', city: 'Sydney, AU', date: new Date(2023, 7, 12) },
            { id: 61, home: 'W58', away: 'W57', city: 'Auckland, NZ', date: new Date(2023, 7, 15) },
            { id: 62, home: 'W59', away: 'W60', city: 'Sydney, AU', date: new Date(2023, 7, 16) },
            { id: 63, home: 'L61', away: 'L62', city: 'Brisbane, AU', date: new Date(2023, 7, 19) },
            { id: 64, home: 'W61', away: 'W62', city: 'Sydney, AU', date: new Date(2023, 7, 20) },
        ];
    };
    return MatchService;
}());
function calcDistance(a, b) {
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

var matchService = new MatchService();

var rows = [['group', 'seed', 'finish1', 'finish2']];
var countries = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(function (i) { return [1, 2, 3, 4].map(function (j) { return "" + i + j; }); }).flat();
for (var _i = 0, countries_1 = countries; _i < countries_1.length; _i++) {
    var country = countries_1[_i];
    var cities = matchService.getCities(country).map(function (c) { return typeof c === 'string' ? c : c[0]; });
    var dist = 0;
    for (var i = 0; i < cities.length - 1; i++) {
        dist += calcDistance(cities[i], cities[i + 1]);
    }
    var cities2 = matchService.getCities(country).map(function (c) { return typeof c === 'string' ? c : c[1]; });
    var dist2 = 0;
    for (var i = 0; i < cities2.length - 1; i++) {
        dist2 += calcDistance(cities2[i], cities2[i + 1]);
    }
    rows.push([country.charAt(0), country.charAt(1), "" + dist, "" + dist2]);
}

const fs = require('fs');
fs.writeFile('distances.csv', rows.map(function (e) { return e.join(","); }).join("\n"), () => { });