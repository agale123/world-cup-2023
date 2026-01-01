import { Component, Input, OnInit } from "@angular/core";
import { CountryService, FLAGS } from "../country.service";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styles: [],
})
export class TeamComponent implements OnInit {
  @Input("value") value!: string;
  @Input("projections") projections!: string[];

  constructor(public readonly countryService: CountryService) {}

  ngOnInit(): void {}

  showProjections() {
    const formatted = this.countryService.formatCountry(this.value);
    if (
      !formatted.includes("1") &&
      !formatted.includes("2") &&
      !formatted.includes("W")
    ) {
      return false;
    }
    return (
      ["W", "1", "2"].includes(this.value?.slice(0, 1) || "") &&
      this.projections[0] !== this.value
    );
  }

  formatFlag(country: string) {
    return FLAGS[this.countryService.formatCountry(country)];
  }
}
