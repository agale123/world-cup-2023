import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country.service';
import { Match, MatchService } from '../match.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css'],
})
export class ItineraryComponent implements OnInit {

  matches: Match[] = this.matchService.getMatches().filter(m => m.id <= 8);

  constructor(private readonly countryService: CountryService, private readonly matchService: MatchService) { }

  formatCountry(country: string) {
    return this.countryService.formatCountry(country);
  }

  formatDate(date: Date, city: string) {
    return this.matchService.formatDate(date, city);
  }

  ngOnInit(): void {
  }

}
