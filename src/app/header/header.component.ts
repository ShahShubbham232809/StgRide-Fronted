import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { AuthGuard } from "../auth.guard";
import { NavigateService } from "src/Services/navigate.service";
import { UserdataService } from "src/Services/userdata.service";
import { Router } from "@angular/router";
import { LoginComponent } from "../login/login.component";
import { FormBuilder } from "@angular/forms";
import { SocketService } from "src/Services/socket.service";
import { PushnotificationService } from "src/Services/pushnotification.service";
// import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  loggedin: any;
  notLoggedIn: any;
  value = true;
  user: any;
  token: any;
  sidenav: any = false;
  navbar: any = true;
  count = 0
  constructor(
    private LogIn: NavigateService,
    private logoutUse: UserdataService,
    private cookie: CookieService,
    private auth: AuthGuard,
    private toastr: ToastrService,
    private socketservice:SocketService,
    private router: Router,
    private pushnotification: PushnotificationService,
    private loginservice: NavigateService // private fd:FormBuilder
  ) // private userdata:LoginComponent
  {
    this.loginservice.loggedin.subscribe((result) => {
      this.loggedin = result;
    });
    this.loginservice.loggedout.subscribe((result) => {
      this.notLoggedIn = result;
    });
  }
  ngOnInit() {
    if (localStorage.getItem("jwt")) {
      this.loggedin = true;
      this.notLoggedIn = false;
    } else {
      this.loggedin = false;
      this.notLoggedIn = true;
    }

    this.socketservice.emit("push-notification",'');
    this.socketservice.onDataReceived('push-notification').subscribe((data)=>{
      const result = data
      this.count = result.rides
      this.pushnotification.requestNotificationPermission();
      if(result.boolean == true){
        const message = "NO Driver Found!!!!";
        this.pushnotification.sendNotification(message);
      }
    })
    // this.count = localStorage.getItem('notificationCount')
  }
  routenotification(){
    this.router.navigate(['dashboard/confirmride'])
  }
  nav(val: any) {
    this.loginservice.nav.emit(val);
  }

  clicked(value: boolean) {
    this.LogIn.loggedin.subscribe((data) => {
      if (data == true) {
        this.value = !this.value;
      }
    });
  }
  logout() {
    this.user = localStorage.getItem("user");
    this.token = localStorage.getItem("jwt")?.toString();

    this.logoutUse.logoutUser(this.user, this.token).subscribe((result) => {});
    this.notLoggedIn = true;
    this.loggedin = false;
    this.loginservice.loggedin.emit(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    this.router.navigate(["home"]);
    this.toastr.warning("Logout Successfully!!");
    this.loginservice.loggedout.emit(true);
    this.loginservice.loggedin.emit(false);
    localStorage.setItem("notificationCount", "0");
  }
}
