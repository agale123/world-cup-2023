import { Injectable } from '@angular/core';

// TODO(agale): Update with final list of countries.
const COUNTRIES: {[key: string]: string} = {
  'A1': 'New Zealand',
  'A2': 'A2 formatted',
  'A3': 'A3 formatted',
  'A4': 'A4 formatted',
  'B1': 'Australia',
  'B2': 'B2 formatted',
  'B3': 'B3 formatted',
  'B4': 'B4 formatted',
  'C1': 'C1 formatted',
  'C2': 'C2 formatted',
  'C3': 'C3 formatted',
  'C4': 'C4 formatted',
  'D1': 'D1 formatted',
  'D2': 'D2 formatted',
  'D3': 'D3 formatted',
  'D4': 'D4 formatted',
  'E1': 'E1 formatted',
  'E2': 'E2 formatted',
  'E3': 'E3 formatted',
  'E4': 'E4 formatted',
  'F1': 'F1 formatted',
  'F2': 'F2 formatted',
  'F3': 'F3 formatted',
  'F4': 'F4 formatted',
  'G1': 'G1 formatted',
  'G2': 'G2 formatted',
  'G3': 'G3 formatted',
  'G4': 'G4 formatted',
  'H1': 'H1 formatted',
  'H2': 'H2 formatted',
  'H3': 'H3 formatted',
  'H4': 'H4 formatted',
};

export const FLAGS: {[key: string]: string} = {
  'Argentina': '🇦🇷',
  'Australia': '🇦🇺',
  'Brazil': '🇧🇷',
  'Canada': '🇨🇦',
  'China PR': '🇨🇳',
  'Colombia': '🇨🇴',
  'Costa Rica': '🇨🇷',
  'Denmark': '🇩🇰',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Italy': '🇮🇹',
  'Jamaica': '🇯🇲',
  'Japan': '🇯🇵',
  'Morocco': '🇲🇦',
  'Netherlands': '🇳🇱',
  'New Zealand': '🇳🇿',
  'Nigeria': '🇳🇬',
  'Norway': '🇳🇴',
  'Philippines': '🇵🇭',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'Spain': '🇪🇸',
  'Sweden': '🇸🇪',
  'United States': '🇺🇸',
  'Vietnam': '🇻🇳',
  'Zambia': '🇿🇲',
};

export const CITIES = {
  'Adelaide, AU': [138.6007, -34.9285],
  'Auckland, NZ': [174.6645, -36.7509],
  'Brisbane, AU': [153.0260, -27.4705],
  'Dunedin, NZ': [170.5006, -45.8795],
  'Hamilton, NZ': [175.2528, -37.9826],
  'Melbourne, AU': [144.9631, -37.8136],
  'Perth, AU': [115.8613, -31.9523],
  'Sydney, AU': [151.2093, -33.8688],
  'Wellington, NZ': [174.7787, -41.2924],
};

export const CITY_TITLE = {
  'Adelaide, AU': 'Tarntanya',
  'Auckland, NZ': 'Tāmaki Makaurau',
  'Brisbane, AU': 'Meaanjin',
  'Dunedin, NZ': 'Ōtepoti',
  'Hamilton, NZ': 'Kirikiriroa',
  'Melbourne, AU': 'Naarm',
  'Perth, AU': 'Boorloo',
  'Sydney, AU': 'Gadigal',
  'Wellington, NZ': 'Te Whanganui-a-Tara'
};

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  formatCountry(country: string) {
    return COUNTRIES[country] || country;
  }
}
