import { PushnotificationService } from "./../../../Services/pushnotification.service";
import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/Services/socket.service";
import { NavigateService } from "src/Services/navigate.service";
import { Router } from "@angular/router";
import { ObjectId } from "mongodb";
import { Subscription } from "rxjs";
@Component({
  selector: "app-assigndriver",
  template: `
    <div class="card m-3 p-2">
      <ng-container *ngIf="driverfind">
        <div class="table row table-responsive">
          <table class="table align-middle mb-0 bg-white text-center">
            <thead class="bg-light">
              <tr>
                <th class="text-center">Profile</th>
                <th class="text-center">Name</th>
                <th class="text-center">Email</th>
                <th class="text-center">Phone Number</th>
                <th class="text-center">Country</th>
                <th class="text-center">City</th>
                <th class="text-center">Assigned Service</th>
                <th class="text-center">Assign Service</th>
              </tr>
            </thead>
            <tbody>
              <tr class="stg" *ngFor="let driver of driverData; let i = index">
                <td>
                  <div class="d-flex align-items-center justify-content-center">
                    <img
                      src="http://127.0.0.1:5000/driver/{{ driver.profile }}"
                      alt=""
                      style="width: 45px; height: 45px;"
                      class="rounded-circle"
                    />
                  </div>
                </td>
                <td>
                  <p class="fw-normal mb-1">{{ driver.name }}</p>
                </td>
                <td>
                  <span class="d-inline">{{ driver.email }}</span>
                </td>
                <td>{{ driver.countrycode + driver.number }}</td>
                <td>{{ driver.countryid.countryname }}</td>
                <td>{{ driver.cityid.cityname }}</td>
                <td>
                  {{ driver.typeid.cartype | uppercase }}
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-info btn-rounded"
                    id="{{ driver._id }}"
                    (click)="AssignDriver($event.target, data.id, '1', null)"
                    style="margin: 0 auto;"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <ng-container *ngIf="nodriver">
        <div>No Driver Found at This Moment.....</div>
      </ng-container>

      <div class="d-flex justify-content-center" *ngIf="!nodriver">
        <!-- <ng-container> -->

        <button
          type="button"
          class="btn btn-info btn-rounded"
          id="{{ this.nearestdriverid }}"
          (click)="AssignDriver($event.target, data.id, '2', driverData)"
          style="margin: 0 auto;"
        >
          Assign Nearest Driver
        </button>
        <!-- </ng-container> -->
      </div>
      <div class="d-flex justify-content-center">
        <div>
          <button
            mat-button
            mat-dialog-close
            class="btn btn-success btn-rounded m-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./assigndriver.component.scss"],
})
export class AssigndriverComponent implements OnInit, OnDestroy {
  id: any;
  nodriver: any = false;
  details: any;
  driverfind: any = true;
  driverupdatelist: any = false;
  @Output() dialogClosed = new EventEmitter<string>();
  driverData: any;
  update: any;
  id2: any;
  driverid: any;
  nearestdriverid: any;
  driverData2: any;
  onDataReceivedSub: Subscription = new Subscription();
  ngOnDestroy(): void {
    this.onDataReceivedSub.unsubscribe();
  }
  ngOnInit() {
    this.id = this.data.id;
    this.id2 = this.id._id;
    this.nearestdriverid = "";
    this.rideservice.emit("get-driver-data", "");
    this.getdriverlist();
  }

  constructor(
    public dialogRef: MatDialogRef<AssigndriverComponent>,
    private toaster: ToastrService,
    private http: HttpClient,
    private rideservice: SocketService,
    @Inject(MAT_DIALOG_DATA) public data: DriverData,
    private navigate: NavigateService,
    private router: Router,
  ) {}
  getdriverlist() {
    this.onDataReceivedSub = this.rideservice
      .onDataReceived("driver-data")
      .subscribe((data) => {
        this.driverData = data.filter((driver: any) => {
          return (
            driver.cityid._id === this.id.cityId._id &&
            driver.typeid.cartype === this.id.vehicleId.cartype &&
            driver.RideStatus == "Online" &&
            driver.Status == "Approved"
          );
        });

        if (this.driverData == "") {
          this.nodriver = true;
          this.driverfind = false;
        } else {
          this.nearestdriverid = this.driverData[0]._id;
          this.nodriver = false;
          this.driverfind = true;
        }
      });
  }
  async AssignDriver(ID: any, val: any, number: any, driverdata: any) {
    let data: { driverdata?: any; id?: any; data?: any; status?: any };
    let ids: any;
    if (number == "1") {
      data = {
        id: ID.id,
        data: val,
        status: number,
        driverdata: null,
      };
    } else {
      this.rideservice.emit("get-driver-data", "");
      this.rideservice.onmethod().on("driver-data", async (data) => {
        this.driverid = await data.filter((driver: any) => {
          return (
            driver.cityid._id === this.id.cityId._id &&
            driver.typeid.cartype === this.id.vehicleId.cartype &&
            driver.Status == "Approved"
          );
        });
        ids = await this.driverid.map((driver: any) => {
          return driver._id as ObjectId;
        });
      });
    }
    setTimeout(() => {
      data = {
        id: ID.id,
        data: val,
        status: number,
        driverdata: ids,
      };
      this.toaster.success("Ride Assigned", "");
      this.rideservice.emit("running-ride-data", data);
      this.rideservice.onmethod().on("createride-data", (data) => {
        // this.router.navigate(['dashboard/confirmride']);
        this.dialogRef.close({ data, id: this.id2 });
        // this.navigate.runningride.emit(true);
      });
    }, 100);
  }
}
export interface DriverData {
  title: string;
  id: String;
}
