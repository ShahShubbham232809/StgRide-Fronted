import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ListComponent } from './drivers/list/list.component';
import { RunningrequestComponent } from './drivers/runningrequest/runningrequest.component';
import { CityComponent } from './pricing/city/city.component';
import { CountryComponent } from './pricing/country/country.component';
import { VehiclepriceComponent } from './pricing/vehicleprice/vehicleprice.component';
import { VehicletypeComponent } from './pricing/vehicletype/vehicletype.component';
import { ConfirmedrideComponent } from './rides/confirmedride/confirmedride.component';
import { CreaterideComponent } from './rides/createride/createride.component';
import { HistoryComponent } from './rides/history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'createride',
        component:CreaterideComponent
      },
      {
        path: 'confirmride',
        component: ConfirmedrideComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'driverslist',
        component: ListComponent,
      },
      {
        path: 'runningrequest',
        component: RunningrequestComponent,
      },
      {
        path: 'city',
        component: CityComponent,
      },
      {
        path: 'country',
        component: CountryComponent,
      },
      {
        path: 'vehicletype',
        component: VehicletypeComponent,
      },
      {
        path: 'vehicleprice',
        component: VehiclepriceComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'setting',
        component: SettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
