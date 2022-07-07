import { Injectable } from '@angular/core';

export interface Fact {
  name: string,
  value: string,
};

@Injectable({
  providedIn: 'root'
})
export class FactService {

  constructor() { }

  // TODO(agale): Populate facts for each country. Ideas include: number of past
  // tournaments, best finish, wins, FIFA rank, population.
  getFacts(country: string): Fact[] {
    return [
      { name: 'Population', value: 'x' },
      { name: 'Wins', value: 'x' },
    ]
  }
}
