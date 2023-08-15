import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import * as bulmaCalendar from "bulma-calendar";
import { ToastrService } from "ngx-toastr";
import { Time } from "ngx-ui-loader";
import { Subscription } from "rxjs";
import { CreaterideService } from "src/Services/createride.service";
import { NavigateService } from "src/Services/navigate.service";
import { SocketService } from "src/Services/socket.service";
import { VehicletypeService } from "src/Services/vehicletype.service";
import { AssigndriverComponent } from "../../assigndriver/assigndriver.component";
import { RideData, RideinfoComponent } from "../../rideinfo/rideinfo.component";
// import { ExportToCsv } from "export-to-csv";
import * as Papa from "papaparse";
import { saveAs } from "file-saver";
import { state } from "@angular/animations";
@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
})
export class HistoryComponent implements OnInit, OnDestroy {
  page: number = 1;
  count: number = 0;
  tableSize: number = 2;
  page2: number = 1;
  count2: number = 0;
  tableSize2: number = 2;
  inputValue: any;
  sort = "dscs";
  searchkey: any;
  addlist: any;
  searchlist: any = false;
  nodriver: any = false;
  ridelist: any[] = [];
  searchridelist: any[] = [];
  data2: any;
  data3: any;
  data4: any;
  date!: Date;
  time!: Time;
  onDataReceivedSub: Subscription = new Subscription();

  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userData: any;
  carsList: any;
  date2!: Date;
  filter !: boolean;
  maindata : any;
  ngOnInit() {
    this.getRideList();
    this.getservicelist();
    this.addlist = true;
    this.dataSource = new MatTableDataSource(this.ridelist);
    this.onDataReceivedSub = this.socketservice
      .onDataReceived("ridehistory-data")
      .subscribe((data) => {
        console.log(data);

        if(this.searchlist == true && this.filter == true){
          this.SearchbyFilter()
        }else if(this.searchlist == true){
          this.searchdriver(this.searchkey)
        }else{
          this.data2 = data;
          this.ridelist = this.data2.data;
          this.count = this.data2.count;
          if (this.count == 0) {
            this.nodriver = true;
            this.addlist = false;
            this.searchlist = false;
          }
        }

      });
    // this.createcalender()
  }
  constructor(
    private createrideservice: CreaterideService,
    private dialog: MatDialog,
    private socketservice: SocketService,
    private navigate: NavigateService,
    private carservice: VehicletypeService
  ) {}

  getservicelist() {
    this.carservice.getCarList().subscribe((result) => {
      this.carsList = result;
      // this.length = Object.keys(this.carsList).length;
    });
  }
  ByDate(val: any) {
    //
    this.date = val.value;
  }
  sorting(val: any) {
    this.sort = val.value;
    this.getRideList();
  }
  openDialog(val: any) {
    const dialogData: RideData = {
      title: "Assigned Ride Service",
      id: val,
    };

    const dialogRef: MatDialogRef<RideinfoComponent> = this.dialog.open(
      RideinfoComponent,
      {
        width: "800px",
        data: dialogData,
      }
    );

    dialogRef.componentInstance.dialogClosed.subscribe((data: string) => {
      const service = data[0];
      const id = data[1];
      this.createrideservice.EditRide(id).subscribe((result) => {});
    });
  }
  convertToHoursAndMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}Hrs ${minutes}Mins`;
  }
  ByDate2(val: any) {
    this.date2 = val.value;
  }

  getRideList() {
    this.socketservice.emit("get-ridehistory-data", {
      page: this.page,
      size: this.tableSize,
      sort: this.sort,
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getRideList();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getRideList();
  }
  onTableDataChange2(event: any) {
    this.page2 = event;
    if (this.filter == true) {
      this.SearchbyFilter();
      console.log("called filter");
    }else{
     this.searchdriver(this.searchkey)
    }
  }

  onTableSizeChange2(event: any) {
    this.tableSize = event.target.value;
    this.page2 = 1;
    this.searchdriver(this.searchkey)
  }
  cancelsearch() {
    this.searchlist = false;
    this.addlist = true;
    this.inputValue = "";
    this.nodriver = false;
    if (this.inputValue != "") {
      this.searchdriver(0);
    }
  }
  searchdriver(val: any) {
    this.searchlist = true;
    this.addlist = false;
    this.nodriver = false;
    if (val != 0) {
      this.searchkey = val;
    }
    if (val != "") {
      if (val != 0) {
        this.createrideservice
          .SearchRideHistory(val, this.page2, this.tableSize2, this.sort)
          .subscribe((result) => {
            console.log("xhdci", result);
            this.data3 = result;
            if (this.data3.count == 0) {
              console.log("aavya");

              this.searchlist = false;
              this.nodriver = true;
            }
            this.searchridelist = this.data3.data;
            this.count2 = this.data3.count;
          });
      } else {
        this.createrideservice
          .SearchRideHistory(val, this.page2, this.tableSize, this.sort)
          .subscribe((result) => {
            console.log("Page Changes", result);
            this.data4 = result;
            if (this.data4.user == "") {
              this.searchlist = false;
              this.nodriver = true;
            } else {
              this.data3 = result;
              this.searchridelist = this.data3.user;
              this.count2 = this.data3.count;
            }
          });
      }
    } else {
      this.nodriver = true;
      this.searchlist = false;
    }
  }

  cancelride(val: any) {
    this.socketservice.emit("cancel-ride", val);
  }
  async convertToCSV() {
    if (this.searchlist == true && this.filter == false) {
      try {
        const result = await this.createrideservice.SearchRideHistory(this.searchkey, 0, 0, this.sort).toPromise();
        this.data3 = result;
        this.maindata = this.data3.data;
      } catch (error) {
        console.error("Error in SearchRideHistory:", error);
      }
    } else if (this.filter == true && this.searchlist == true) {
      const date = document.getElementById("date") as HTMLInputElement;
      const date2 = document.getElementById("date2") as HTMLInputElement;
      const status = document.getElementById("status") as HTMLSelectElement;
      const service = document.getElementById("service") as HTMLInputElement;

      try {
        const data = await this.createrideservice.SearchRideHistoryByFilter(
          {
            date: date.value,
            date2: date2.value,
            status: status.value,
            service: service.value,
          },
          0,
          0,
          this.sort
        ).toPromise();
        this.data3 = data;
        this.maindata = this.data3.data;
      } catch (error) {
        console.error("Error in SearchRideHistoryByFilter:", error);
      }
    } else if (this.addlist == true) {
      try {
        const result = await this.createrideservice.GetRideHistory(0, 0, "desc").toPromise();
        console.log(result);

        this.data3 = result;
        this.maindata = this.data3.data;
      } catch (error) {
        console.error("Error in GetRides:", error);
      }
    } else {
      console.log("no dataaaa");
    }

    const csvRows = [];
    const headers = [
          "_id",
          "paymentOption",
          "rideTime",
          "serviceType",
          "rideDate",
          "userId_id",
          "userId_name",
          "driverID_id",
          "driverID_name",
          "Status",
          "RideStatus",
          "startLocation",
          "endLocation",
          "wayPoints",
          "totalDistance",
          "totalTime",
          "estimateFare",
          "DriverProfit",
          "AssigingTime",
        ];

    csvRows.push(headers.join(","));
    const waypointsToString = (waypoints:any) => {
      if (!waypoints || !Array.isArray(waypoints) || waypoints.length === 0) {
        return "";
      }

      return waypoints
        .map((waypoint) => {
          if (waypoint && waypoint.location) {
            return waypoint.location;
          }
          return "";
        })
        .join(";");
    };
    const formatTotalDistance = (distance:any) => {
      const formattedDistance = parseFloat(distance).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedDistance + " km";
    };

    // Helper function to format totalTime into hours and minutes
    const formatTotalTime = (timeInMinutes:any) => {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = Math.floor(timeInMinutes % 60);
      return `${hours}h ${minutes}min`;
    };
    const mapStatusToText = (statusValue:any) => {
      switch (statusValue) {
        case 0:
          return "Pending";
        case 3:
          return "Cancelled";
        case 7:
          return "Completed";
        default:
          return "";
      }
    };
    const formatEstimateFare = (fare:any) => {
      const formattedFare = parseFloat(fare).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
      return formattedFare;
    };

    for (const row of this.maindata) {
      const values = await Promise.all(
        headers.map(async (header) => {
          let value = row[header];

          if (header === "userId_id") {
            if (row.userId && row.userId._id) {
              return row.userId._id;
            } else {
              return "";
            }
          }

          if (header === "userId_name") {
            if (row.userId && row.userId.name) {
              return row.userId.name;
            } else {
              return "";
            }
          }
          if (header === "driverID_id") {
            if (row.driverID && row.driverID._id) {
              return row.driverID._id;
            } else {
              return "";
            }
          }
          if (header === "driverID_name") {
            if (row.driverID && row.driverID.name) {
              return row.driverID.name;
            } else {
              return "";
            }
          }else if (header === "wayPoints") {
            value = waypointsToString(value);
          }else  if (header === "Status") {
            value = mapStatusToText(value);
          } else if (header === "estimateFare") {
            value = formatEstimateFare(value);
          }else if (header === "DriverProfit") {
            value = formatEstimateFare(value);
          }else if (header === "totalDistance") {
            value = formatTotalDistance(value);
          } else if (header === "totalTime") {
            value = formatTotalTime(value);
          }
          return typeof value === "string" ? `"${value}"` : value;
        })
      );

      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  downloadCSV(data: string, filename: string) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async download() {
    try {
      const csvData = await this.convertToCSV();
      const filename = "data.csv";
      this.downloadCSV(csvData, filename);
    } catch (error) {
      console.error("Error while downloading CSV:", error);
    }
  }


  SearchbyFilter() {
    this.filter = true;
    this.searchlist = true;
    this.addlist = false;
    this.nodriver = false;
    const date = document.getElementById("date") as HTMLInputElement;
    const date2 = document.getElementById("date2") as HTMLInputElement;
    const status = document.getElementById("status") as HTMLSelectElement;
    const service = document.getElementById("service") as HTMLInputElement;

    this.createrideservice
      .SearchRideHistoryByFilter(
        {
          date: date.value,
          date2: date2.value,
          status: status.value,
          service: service.value,
        },
        this.page2,
        this.tableSize2,
        this.sort
      )
      .subscribe((data: any) => {
        this.data3 = data;
        console.log("called");

        if (this.data3.data == "") {
          this.searchlist = false;
          this.nodriver = true;
        }
        this.searchridelist = this.data3.data;
        this.count2 = this.data3.count;
      });
  }
  clearSearch() {
    this.searchlist = false;
    this.addlist = true;
    this.nodriver = false;
    this.inputValue = "";
    this.filter = false;
    const date = document.getElementById("date") as HTMLInputElement;
    const time = document.getElementById("date2") as HTMLInputElement;
    const status = document.getElementById("status") as HTMLSelectElement;
    const service = document.getElementById("service") as HTMLInputElement;

    if (date) {
      date.value = ""; // Clear the value of the date input
    }

    if (time) {
      time.value = ""; // Clear the value of the time input
    }
  }
  ngOnDestroy(): void {
    this.onDataReceivedSub.unsubscribe();
  }
}
