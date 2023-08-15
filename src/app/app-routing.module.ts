import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListComponent } from './dashboard/drivers/list/list.component';
import { RunningrequestComponent } from './dashboard/drivers/runningrequest/runningrequest.component';
import { CityComponent } from './dashboard/pricing/city/city.component';
import { CountryComponent } from './dashboard/pricing/country/country.component';
import { VehiclepriceComponent } from './dashboard/pricing/vehicleprice/vehicleprice.component';
import { VehicletypeComponent } from './dashboard/pricing/vehicletype/vehicletype.component';
import { ConfirmedrideComponent } from './dashboard/rides/confirmedride/confirmedride.component';
import { CreaterideComponent } from './dashboard/rides/createride/createride.component';
import { HistoryComponent } from './dashboard/rides/history/history.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { UsersComponent } from './dashboard/users/users.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path:"",
    component:HomeComponent

  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"signup",
    component:SignupComponent
  },
  {
    path:"home",
    component:HomeComponent
  },
    { path: "dashboard",
    canActivate:[AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path:"logout",
    component:HomeComponent
  },
  {
    path:"**",
    component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
