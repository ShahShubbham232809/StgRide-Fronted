import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
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
// import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { UsersComponent } from './users/users.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { StripeModule } from 'stripe-angular';
import { environment } from 'src/envirnment';
import { CardsComponent } from './cards/cards.component';
import { RideinfoComponent } from './rideinfo/rideinfo.component';
// import { CardsComponent } from './cards/cards.component';
// import { DialogComponent } from './dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { AssigndriverComponent } from './assigndriver/assigndriver.component'
import { SocketService } from 'src/Services/socket.service';
import { MaterialModule } from '../material-modules';

@NgModule({
  declarations: [
    DashboardComponent,
    CreaterideComponent,
    ConfirmedrideComponent,
    HistoryComponent,
    SettingsComponent,
    UsersComponent,
    ListComponent,
    RunningrequestComponent,
    CityComponent,
    VehicletypeComponent,
    VehiclepriceComponent,
    CountryComponent,
    DialogComponent,
    CardsComponent,
    RideinfoComponent,
    AssigndriverComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    CommonModule
  ],
  providers:
    [SocketService]

})
export class DashboardModule { }
