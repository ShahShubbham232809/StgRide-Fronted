import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CreaterideService } from "src/Services/createride.service";
import { RideData, RideinfoComponent } from "../../rideinfo/rideinfo.component";
import { io } from "socket.io-client";
import { SocketService } from "src/Services/socket.service";
import { AssigndriverComponent } from "../../assigndriver/assigndriver.component";
import { NavigateService } from "src/Services/navigate.service";
import { Subscription } from "rxjs";
import { VehicletypeService } from "src/Services/vehicletype.service";

@Component({
  selector: "app-confirmedride",
  templateUrl: "./confirmedride.component.html",
  styleUrls: ["./confirmedride.component.scss"],
})
export class ConfirmedrideComponent implements OnInit, OnDestroy {
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
  onDataReceivedSub: Subscription = new Subscription();

  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userData: any;
  filter !: boolean;
  carsList: any;
  date: any;
  date2: any;
  ngOnInit() {
    this.getRideList();
    this.getservicelist();
    this.addlist = true;
    this.dataSource = new MatTableDataSource(this.ridelist);
    this.onDataReceivedSub = this.socketservice
      .onDataReceived("createride-data")
      .subscribe((data) => {
        if(this.searchlist == true){
          console.log("search");

          this.searchdriver(this.searchkey)
        }else if(this.searchlist == true && this.filter == true){
          console.log("filter");

          this.SearchbyFilter()
        }else{
          console.log("get");

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
  }
  ByDate(val: any) {
    //
    this.date = val.value;
  }
  ByDate2(val: any) {
    this.date2 = val.value;
  }
  constructor(
    private createrideservice: CreaterideService,
    private dialog: MatDialog,
    private socketservice: SocketService,
    private navigate: NavigateService,
    private carservice:VehicletypeService
  ) {}
  openDialog(val: any) {
    const dialogData: RideData = {
      title: "Assigned Ride Service",
      id: val,
    };

    const dialogRef: MatDialogRef<RideinfoComponent> = this.dialog.open(
      RideinfoComponent,
      {
        width: "400px",
        data: dialogData,
      }
    );

    dialogRef.componentInstance.dialogClosed.subscribe((data: string) => {
      const service = data[0];
      const id = data[1];
      this.createrideservice.EditRide(id).subscribe((result) => {});
    });
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
      .SearchRideHistoryByFilterInConfirm(
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
  sendUserData(val: any) {
    const dialogData: RideData = {
      title: "Assigned Driver Service",
      id: val,
    };

    const dialogRef: MatDialogRef<AssigndriverComponent> = this.dialog.open(
      AssigndriverComponent,
      {
        width: "1000px",
        data: dialogData,
      }
    );

    dialogRef.componentInstance.dialogRef.afterClosed().subscribe((data) => {
      this.getRideList();
    });
  }
  getRideList() {
    console.log(this.page);
    this.socketservice.emit("get-creteride-data", {
      page: this.page,
      size: this.tableSize,
      sort: this.sort,
    });
  }
  getservicelist() {
    this.carservice.getCarList().subscribe((result) => {
      this.carsList = result;
      // this.length = Object.keys(this.carsList).length;
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
    this.searchdriver(this.searchkey);
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
  convertToHoursAndMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}Hrs ${minutes}Mins`;
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
          .SearchRide(val, this.page2, this.tableSize2, this.sort)
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
          .SearchRide(val, this.page2, this.tableSize, this.sort)
          .subscribe((result) => {
            console.log("Page Changes", result);
            this.data4 = result;
            if (this.data4.user == "") {
              this.searchlist = false;
              this.nodriver = true;
            } else {
              this.data3 = result;
              this.searchridelist = this.data3.data;
              this.count2 = this.data3.count;
            }
          });
      }
    } else {
      this.nodriver = true;
      this.searchlist = false;
    }
  }
  sorting(val: any) {
    this.sort = val.value;
    this.getRideList();
  }
  cancelride(val: any) {
    this.socketservice.emit("cancel-ride", val);
  }

  ngOnDestroy(): void {
    this.onDataReceivedSub.unsubscribe();
  }
}
