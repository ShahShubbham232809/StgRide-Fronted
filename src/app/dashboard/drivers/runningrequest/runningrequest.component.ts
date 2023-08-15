import { Component, OnDestroy, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { NavigateService } from "src/Services/navigate.service";
import { SocketService } from "src/Services/socket.service";

@Component({
  selector: "app-runningrequest",
  templateUrl: "./runningrequest.component.html",
  styleUrls: ["./runningrequest.component.scss"],
})
export class RunningrequestComponent implements OnInit, OnDestroy {
  runningridelist: any;
  nodriver!: boolean;
  ride!: boolean;
  onDataReceivedSub: Subscription = new Subscription();
  ngOnDestroy(): void {
    this.onDataReceivedSub.unsubscribe();
  }
  ngOnInit() {
    this.getRunningRides();
    this.navigate.runningride.subscribe((data: any) => {
      this.getRunningRides();
    });
  }
  constructor(
    private socketservice: SocketService,
    private navigate: NavigateService,
    private toastr: ToastrService
  ) {}
  getRunningRides() {
    this.socketservice.emit("get-runningride-data", "");
    this.onDataReceivedSub = this.socketservice
      .onDataReceived("runningride-data")
      .subscribe((data: any) => {
        console.log(data);

        this.runningridelist = data;

        if (this.runningridelist.length == 0) {
          this.nodriver = true;
          this.ride = false;
        } else {
          this.nodriver = false;
          this.ride = true;
        }
      });
  }
  sendUserData(val: any) {
    this.socketservice.emit("status-updated-ride", { details: val });
  }
  deleteRide(val: any) {
      this.socketservice.emit("delete-ride", val);
      this.toastr.info("Ride Cancelled", "");
      this.getRunningRides()
  }
  StatusUpdater(val: any) {
    this.socketservice.emit("status-updater", { data: val });
  }
}
