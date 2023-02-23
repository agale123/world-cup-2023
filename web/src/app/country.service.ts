import { Injectable } from '@angular/core';

const COUNTRIES: {[key: string]: string} = {
  'A1': 'New Zealand',
  'A2': 'Norway',
  'A3': 'Philippines',
  'A4': 'Switzerland',
  'B1': 'Australia',
  'B2': 'Ireland',
  'B3': 'Nigeria',
  'B4': 'Canada',
  'C1': 'Spain',
  'C2': 'Costa Rica',
  'C3': 'Zambia',
  'C4': 'Japan',
  'D1': 'England',
  'D2': 'Haiti',
  'D3': 'Denmark',
  'D4': 'China',
  'E1': 'United States',
  'E2': 'Vietnam',
  'E3': 'Netherlands',
  'E4': 'Portugal',
  'F1': 'France',
  'F2': 'Jamaica',
  'F3': 'Brazil',
  'F4': 'Panama',
  'G1': 'Sweden',
  'G2': 'South Africa',
  'G3': 'Italy',
  'G4': 'Argentina',
  'H1': 'Germany',
  'H2': 'Morocco',
  'H3': 'Colombia',
  'H4': 'South Korea',
};

export const FLAGS: {[key: string]: string} = {
  'Argentina': '🇦🇷',
  'Australia': '🇦🇺',
  'Brazil': '🇧🇷',
  'Canada': '🇨🇦',
  'China': '🇨🇳',
  'Colombia': '🇨🇴',
  'Costa Rica': '🇨🇷',
  'Denmark': '🇩🇰',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Haiti': '🇭🇹',
  'Ireland': '🇮🇪',
  'Italy': '🇮🇹',
  'Jamaica': '🇯🇲',
  'Japan': '🇯🇵',
  'Morocco': '🇲🇦',
  'Netherlands': '🇳🇱',
  'New Zealand': '🇳🇿',
  'Nigeria': '🇳🇬',
  'Norway': '🇳🇴',
  'Panama': '🇵🇦',
  'Philippines': '🇵🇭',
  'Portugal': '🇵🇹',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'Spain': '🇪🇸',
  'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭',
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
