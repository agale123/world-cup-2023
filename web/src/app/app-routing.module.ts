import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { MapComponent } from './map/map.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'schedule'},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'map', component: MapComponent},
  {path: 'itinerary', component: ItineraryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
