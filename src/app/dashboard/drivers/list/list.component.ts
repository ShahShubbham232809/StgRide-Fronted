import { error } from "jquery";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { CarpriceService } from "src/Services/carprice.service";
import { CountriesService } from "src/Services/countries.service";
import { DriverService } from "src/Services/driver.service";
import { NavigateService } from "src/Services/navigate.service";
import { SocketService } from "src/Services/socket.service";
import { DialogData, DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  typemodal: any = false;
  id: any;
  cityerror: any = false;
  countryList: any;
  cityList: any;
  carTypeList: any;
  value: any = false;
  createCarPrice!: FormGroup;
  countryid: any;
  cityid: any;
  typeid: any;
  carpricelist: any;
  nodriver: any = false;
  searchlist: any = false;
  addlist: any = true;
  // value: any = false;
  adddriver: any = true;
  updatedriver: any = false;
  add: any = false;
  edit: any = false;
  createDriver!: FormGroup;
  input: any;
  countriescode: any;
  countrycodelist: any = [];
  profile: any;
  data: any;
  driverList: any;
  SearchdriverList: any;
  editdriver: any;
  // id: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 2;
  page2: number = 1;
  count2: number = 0;
  tableSize2: number = 2;
  inputValue: any;
  data2: any;
  data3: any;
  data4: any;
  errmsg: any;
  sort = "dasc";
  assignid: any;
  searchkey: any;

  // public displayedColumns = ['profile', 'name', 'email', 'countrycode', 'number' ,'country','city'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  status: any;
  togglevalue: any;
  vehicledata: any;
  updatedcityid: any;
  updatedcountryid: any;
  profileboolean!: boolean;
  profileurl!: string;
  createForm(): void {
    this.createDriver = this.fb.group({
      profile: [""],
      name: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      countrycode: [""],
      number: ["", [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      countryid: ["", Validators.required],
      cityid: ["", Validators.required],
      Status: [""],
      Servicetype: [""],
    });
  }

  ngOnInit() {
    this.getcode();
    this.getcode2();
    this.createForm();
    this.getDriversList();
    this.getCountry();
    this.dataSource = new MatTableDataSource(this.driverList);
    this.navigateservice.driver.emit(true);
    this.socket.onDataReceived("service-updated").subscribe((data) => {
      if(this.searchlist == true){
        this.updatesearchlist()
      }else{
        this.getDriversList()
      }
    });
    this.socket.onDataReceived("status-updated").subscribe((data) => {
      if(this.searchlist == true){
        this.updatesearchlist()
      }else{
        this.getDriversList()
      }
    });
  }
  constructor(
    private driverservice: DriverService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private carpriceservice: CarpriceService,
    private countryservice: CountriesService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private socket: SocketService,
    private navigateservice: NavigateService
  ) {}

  openDialog(val: any) {
    console.log(val);

    const dialogData: DialogData = {
      title: "Assign Vehicle Service",
      id: val,
    };

    const dialogRef: MatDialogRef<DialogComponent> = this.dialog.open(
      DialogComponent,
      {
        width: "400px",
        data: dialogData,
      }
    );

    dialogRef.componentInstance.dialogClosed.subscribe((data: string) => {
      this.vehicledata = data;
      this.socket.emit("service-updated", {
        id: this.vehicledata.id,
        typeid: this.vehicledata.typeid,
      });
      this.navigateservice.driver.emit(true);
    });
  }
  getcode2() {
    this.countryservice.getCountryList2().subscribe((result) => {
      const data = result;
      this.countrycodelist = data;
    });
  }
  getcode() {
    this.driverservice.getCountryList().subscribe((result) => {
      this.countriescode = result;
      this.countriescode.map((result: any) => {
        let code = result.idd.root + result.idd.suffixes[0];
        this.countrycodelist.push(code);
        this.countrycodelist.sort();
      });
    });
  }
  getCountry() {
    this.countryservice.getCountryList2().subscribe((result) => {
      this.countryList = result;
    });
  }
  getDriversList() {
    console.log(this.page);

    this.driverservice
      .GetDrivers(this.page, this.tableSize, this.sort)
      .subscribe((result) => {
        this.data2 = result;
        //
        this.driverList = this.data2.data;
        this.count = this.data2.count;

        if (this.count == 0) {
          this.nodriver = true;
          this.addlist = false;
        }
      });
  }

  button() {
    this.value = !this.value;
    this.createDriver.reset();
    this.adddriver = true;
    this.updatedriver = false;
  }
  inputProfile(event: any) {
    this.profile = event.target.files[0];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (this.profile.size > maxSizeInBytes) {
      // alert('File size exceeds the limit of 5MB.');
      // Reset the file input if needed
      this.toastr.info("Image Size is Very Large..");
      event.target.value = null;
      this.profile = null;
      this.profileboolean = false;
    } else if (!allowedTypes.includes(this.profile.type)) {
      this.toastr.info("Invalid Format..");
      // Reset the file input if needed
      event.target.value = null;
      this.profile = null;
      this.profileboolean = false;
    } else {
      this.profileboolean = true;
      const reader = new FileReader();
      reader.onload = () => {
        // Create the Base64 data URL for the selected file
        this.profileurl = reader.result as string;
      };
      reader.readAsDataURL(this.profile);
    }
  }
  Adddriver(val: any) {
    // if (this.createDriver.valid) {

    if (this.createDriver.valid) {
      const fd = new FormData();
      fd.append("profile", this.profile);
      fd.append("name", val.name);
      fd.append("email", val.email);
      fd.append("number", val.number);
      fd.append("countryid", this.countryid);
      fd.append("cityid", this.cityid);
      fd.append("countrycode", val.countrycode);
      this.driverservice.AddDriver(fd).subscribe(
        (result) => {
          console.log(result);

          this.data = result;
          this.value = false;
          this.getDriversList();
          this.toastr.success("Added Successfully!!!", "");
          if (this.inputValue == "" || this.inputValue == undefined) {
            this.addlist = true;
            this.nodriver = false;
          } else {
            this.searchlist = true;
            this.nodriver = false;
          }
          this.profileboolean = false;
          this.profileurl = "";
        },
        (error: HttpErrorResponse) => {
          console.log(error);

          this.errmsg = error.error.text;
          this.toastr.error(this.errmsg, "");
        }
      );
    } else {
      this.validateAllFormFields(this.createDriver);
    }
  }
  Updatedriver(val: any) {
    console.log(val);

    if (this.profile) {
      val.profile = this.profile;
    }


      if (this.updatedcountryid && this.updatedcityid && this.createDriver.valid) {
        const fd = new FormData();
        fd.append("profile", this.profile);
        fd.append("name", val.name);
        fd.append("email", val.email);
        fd.append("countrycode", val.countrycode);
        fd.append("number", val.number);
        fd.append('cityid',this.updatedcityid)
        fd.append('countryid',this.updatedcountryid)
        if (this.inputValue == "") {
          this.driverservice.UpdateDriver(fd, this.id).subscribe(
            (result) => {
              this.data = result;

              this.value = false;
              this.getDriversList();
              this.toastr.success("Updated Successfully!!!", "");
              this.profileboolean = false;
              this.profileurl = "";
            },
            (error: HttpErrorResponse) => {
              this.errmsg = error.error;
              this.toastr.error(this.errmsg, "");
            }
          );
        } else {
          this.driverservice.UpdateDriver(fd, this.id).subscribe(
            (result) => {
              this.data = result;

              this.value = false;
              this.getDriversList();
              this.updatesearchlist();
              this.toastr.success("Updated Successfully!!!", "");
              this.profileboolean = false;
              this.profileurl = "";
            },
            (error: HttpErrorResponse) => {
              this.errmsg = error.error;
              this.toastr.error(this.errmsg, "");
            }
          );
        }
      } else {
        this.validateAllFormFields(this.createDriver);
      }

  }

  Editdriver(val: any) {
    this.value = true;
    this.adddriver = false;
    this.updatedriver = true;
    this.id =val

    this.driverservice.EditDriver(val).subscribe((result) => {
      this.editdriver = result;
      this.updatedcountryid = this.editdriver.countryid._id;
      this.updatedcityid = this.editdriver.cityid._id;
      this.GetCity(this.editdriver.countryid._id);
      this.createDriver.patchValue({
        name: this.editdriver.name,
        email: this.editdriver.email,
        countrycode: this.editdriver.countryid.countrycode,
        number: this.editdriver.number,
        countryid: this.editdriver.countryid.countryname.toUpperCase(),
        cityid:this.editdriver.cityid.cityname,
      });
    });
  }
  deletedriver(val: any) {
    const del = confirm("Do You Want To Delete it??");

    if (
      (del == true && this.inputValue == undefined) ||
      this.inputValue == ""
    ) {
      this.driverservice.deleteDriver(val.id).subscribe((result) => {
        this.value = false;
        if (this.driverList.length == 1) {
          if (this.page != 1) {
            this.page -= 1;
          } else {
            this.getDriversList();
            this.nodriver = true;
            this.searchlist = false;
            this.addlist = false;
            // this.nodriver = false;
          }
        }
        this.getDriversList();
        this.createDriver.reset();
        this.toastr.error("Deleted Successfully....");
        // }
      });
    } else if (
      (del == true && this.inputValue != "") ||
      this.inputValue != ""
    ) {
      this.driverservice.deleteDriver(val.id).subscribe((result) => {
        this.value = false;
        if (Object.keys(this.SearchdriverList).length == 1) {
          if (this.page2 != 1) {
            this.page2 -= 1;
          } else {
            this.nodriver = true;
            this.searchlist = false;
            this.addlist = false;
          }
        }
        // this.searchdriver(0);
        this.updatesearchlist();
        // this.getDriversList();
        this.createDriver.reset();
        this.toastr.error("Deleted Successfully....");
      });
    } else {
      this.getDriversList();
      this.updatesearchlist();
    }
  }
  cancel() {
    this.createDriver.reset();
    this.value = false;
    this.profileurl = "";
    this.profileboolean = false;
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
  onTableDataChange(event: any) {
    console.log(event);

    this.page = event;
    this.getDriversList();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getDriversList();
  }
  onTableDataChange2(event: any) {
    this.page2 = event;
    this.updatesearchlist();
  }
  onTableSizeChange2(event: any) {
    this.tableSize = event.target.value;
    this.page2 = 1;
    this.updatesearchlist();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
        this.driverservice
          .SearchDriver(val, this.page2, this.tableSize2, this.sort)
          .subscribe((result) => {
            this.data3 = result;
            if (this.data3.user == "") {
              this.searchlist = false;
              this.nodriver = true;
            }
            this.SearchdriverList = this.data3.user;
            this.count2 = this.data3.count;
          });
      } else {
        this.driverservice
          .SearchDriver(val, this.page2, this.tableSize, this.sort)
          .subscribe((result) => {
            this.data4 = result;
            if (this.data4.user == "") {
              this.searchlist = false;
              this.nodriver = true;
            } else {
              this.data3 = result;
              this.SearchdriverList = this.data3.user;
              this.count2 = this.data3.count;
            }
          });
      }
    } else {
      this.nodriver = false;
      this.searchlist = false;
      this.addlist = true;
    }
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
  sorting(val: any) {
    this.sort = val.value;
    this.getDriversList();
  }

  Cityid(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "data-id"
    );
    this.cityid = selectedOptionId;
    console.log(this.cityid);

    this.updatedcityid = selectedOptionId;
  }
  GetCity(val: any) {
    this.carpriceservice.GetCityList(val).subscribe((result) => {
      this.cityList = result;
      if (this.cityList == "") {
        // this.toastr.info('City is not available for this Country','')
        this.cityerror = true;
      } else {
        this.cityerror = false;
      }
    });
  }
  selectedCountry(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "country-id"
    );
    this.countryid = selectedOptionId;
    this.updatedcountryid = selectedOptionId;
    this.countrycodelist.filter((element: any) => {
      if (element.countryname == selectedOption.value) {
        this.createDriver.patchValue({
          countrycode: element.countrycode,
        });
      }
    });

    this.GetCity(selectedOptionId);
  }
  assignservice(event: Event) {
    this.assignid = event.target;
    if (this.assignid.checked == true) {
      this.status = "Approved";
      this.socket.getstatus(true);
    } else {
      this.status = "Declined";
      this.navigateservice.driver.emit(false);
      this.socket.getstatus(true);
    }

    this.socket.emit("status-updated", {
      id: this.assignid.id,
      status: this.status,
    });
    this.navigateservice.driver.emit(true);
  }
  assignvehicle(val: any) {
    this.typeid = !this.typeid;
  }
  updatesearchlist() {
    //
    if (this.searchkey != undefined) {
      this.driverservice
        .SearchDriver(this.searchkey, this.page2, this.tableSize2, this.sort)
        .subscribe((result) => {
          this.data4 = result;
          if (this.data4.user == "") {
            this.searchlist = false;
            this.nodriver = true;
          } else {
            this.data3 = result;
            this.SearchdriverList = this.data3.user;
            this.count2 = this.data3.count;
          }
        });
    }
  }
  ordering(val: any) {
    this.sort = val.value;
    this.getDriversList();
  }
}
