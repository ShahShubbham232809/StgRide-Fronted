import { Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { NavigateService } from "src/Services/navigate.service";
import { UserService } from "src/Services/user.service";
import { UserdataService } from "src/Services/userdata.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IdletimeService } from "src/Services/idletime.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  animations: [
    trigger("rotatedState", [
      state("default1", style({ transform: "rotate(0)" })),
      state("rotated", style({ transform: "rotate(360deg)" })),
      transition("rotated => default1", animate("500ms")),
      transition("default1 => rotated", animate("500ms")),
    ]),
    trigger("rotatedState2", [
      state("default2", style({ transform: "rotate(0)" })),
      state("rotated2", style({ transform: "rotate(360deg)" })),
      transition("rotated2 => default2", animate("1s")),
      transition("default2 => rotated2", animate("1s")),
    ]),
    trigger("rotatedState3", [
      state("default3", style({ transform: "rotate(0)" })),
      state("rotated3", style({ transform: "rotate(360deg)" })),
      transition("rotated3 => default3", animate("1s")),
      transition("default3 => rotated2", animate("1s")),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  loggedin: any = true;
  rotateState = "initial";
  showRides = false;
  showPrice = false;
  showDriver = false;
  state: string | undefined;
  navbar: any = true;
  token: any;
  user: any;
  currentDate!: Date;
  targetDate!: Date;
  idleTimeout: any;
  idleTime = 12000;
  // state: string;
  constructor(
    private router: Router,
    private elef: ElementRef,
    private render2: Renderer2,
    private loginservice: NavigateService,
    private userservice: UserdataService,
    private toastr: ToastrService,
    private idle:IdletimeService
  ) {}
  ngOnInit() {
    // throw new Error('Method not implemented.');
    this.loginservice.nav.subscribe((result) => {

      this.navbar = result;
    });
    this.idle.onIdleTimeout().subscribe((isIdle: boolean) => {
      if (isIdle) {

       this.logout()
      }
    });
    // Event listener for keypress

  }
  logout() {
    this.user = localStorage?.getItem("user");
    this.token = localStorage.getItem("jwt")?.toString();

    this.userservice.logoutUser(this.user, this.token).subscribe((result) => {

    });
    this.loginservice.loggedin.emit(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    this.router.navigate(["home"]);
    this.toastr.warning("Logout Successfully!!");
    this.loginservice.loggedout.emit(true);
    this.loginservice.loggedin.emit(false);
  }

  startIdleTimeout() {
    this.idleTimeout = setTimeout(this.logout, this.idleTime);
  }
  rotate() {
    this.state = this.state === "default1" ? "rotated" : "default1";
    this.showRides = !this.showRides;
  }
  rotate2() {
    this.state = this.state === "default2" ? "rotated2" : "default2";
    this.showDriver = !this.showDriver;
  }
  rotate3() {
    this.state = this.state === "default3" ? "rotated3" : "default3";
    this.showPrice = !this.showPrice;
  }
}
