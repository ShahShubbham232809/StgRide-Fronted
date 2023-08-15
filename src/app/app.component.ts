import { ToastrModule, ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { NavigateService } from "src/Services/navigate.service";
import { UserdataService } from "src/Services/userdata.service";
import { AuthGuard } from "./auth.guard";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  loggedin: any = false;
  token: any;
  user: any;
  currentDate !: Date;
  targetDate !: Date;
  constructor(
    private router: Router,
    private authguard: AuthGuard,
    private userservice: UserdataService,
    private loginservice: NavigateService,
    private idle: Idle,
    private toastr: ToastrService
  ) {
    window.addEventListener("storage", () => {
      this.loggedin = this.userservice.isLoginIn();
      if (localStorage.getItem("jwt")) {
        this.loggedin = true;
      }
      if (this.loggedin == true) {
        this.router.navigate(["dashboard/users"]);
        this.loginservice.loggedout.emit(false);
        this.loginservice.loggedin.emit(true);
      } else {
        // this.router.navigate(["home"]);
        this.loginservice.loggedout.emit(true);
        this.loginservice.loggedin.emit(false);
      }
    });
  }
  ngOnInit() {

  }

  // }
  title = "fronted";
}
