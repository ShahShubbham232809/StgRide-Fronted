import { CUSTOM_ELEMENTS_SCHEMA, NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Footer2Component } from './footer2/footer2.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DashboardModule } from './dashboard/dashboard.module';
import { ToastrModule } from 'ngx-toastr';
import { TokenInterceptor } from './token.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatNativeDateModule } from '@angular/material/core';
// import { UserstableComponent } from './userstable/userstable.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { StripeModule } from 'stripe-angular';
import { environment } from 'src/envirnment';
import { SocketService } from 'src/Services/socket.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule,NgxUiLoaderConfig,SPINNER, POSITION
  ,PB_DIRECTION} from 'ngx-ui-loader';
import { NgIdleModule } from '@ng-idle/core';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Loading...',
  bgsColor: "white",
  bgsPosition: POSITION.bottomRight,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsColor: "black",
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    Footer2Component,
    // UserstableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxFileDropModule,
    // DashboardModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      preventDuplicates: true,
      // closeButton: true,
      progressBar: true
    }),
    NgxPaginationModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    StripeModule.forRoot(environment.stripePublicKey),
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    NgxUiLoaderModule,NgxUiLoaderRouterModule,
        // NgxUiLoaderRouterModule,
    // NgxUiLoaderHttpModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    // NgxUiLoaderHttpModule.forRoot({ showForeground: false }),
    NgIdleModule.forRoot()

    // MatTableModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS , useClass : TokenInterceptor , multi:true},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
