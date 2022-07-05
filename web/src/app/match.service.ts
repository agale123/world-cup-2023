import { Injectable } from '@angular/core';

export type City = 'Adelaide' | 'Auckland' | 'Brisbane' | 'Dunedin' | 'Hamilton' | 'Melbourne' | 'Perth' | 'Sydney' | 'Wellington';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor() { }

  getCities(): Array<City | City[]> {
    return [
      'Hamilton',
      'Dunedin',
      'Sydney',
      ['Auckland', 'Hamilton'],
      ['Dunedin', 'Perth'],
      ['Brisbane', 'Melbourne'],
      'Sydney',
    ];
  }

  getGroups() {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(i => {
      return {
        name: `Group ${i}`, 
        children: [1, 2, 3, 4].map(j => `${i}${j}`),
      };
    });
  }
}
