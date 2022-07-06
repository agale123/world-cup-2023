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

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  formatCountry(country: string) {
    return COUNTRIES[country] || country;
  }
}
