import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
// import { StripeComponent, STRIPE_OPTIONS, StripeSource } from 'stripe-angular';
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/Services/user.service";
import { Sort, MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { environment } from "src/envirnment";
import { StripeCard, StripeModule } from "stripe-angular";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
// import { CardsComponent } from '../cards/cards.component';
import { DialogData } from "../cards/cards.component";
import { StripeScriptTag } from "stripe-angular";
import { CardsComponent } from "../cards/cards.component";
import { CountriesService } from "src/Services/countries.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  // encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  nouser: any = false;
  searchlist: any = false;
  addlist: any = true;
  value: any = false;
  adduser: any = true;
  updateuser: any = false;
  add: any = false;
  edit: any = false;
  createUser!: FormGroup;
  input: any;
  countriescode: any;
  countrycodelist: any = [];
  profile: any;
  data: any;
  UserList: any;
  SearchUserList: any;
  edituser: any;
  id: any;
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
  searchkey: any;
  cardNumber!: string;
  expMonth!: string;
  expYear!: string;
  cvc!: string;
  sort = "dcsc";
  public displayedColumns = [
    "profile",
    "name",
    "email",
    "countrycode",
    "number",
  ];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cards: any;
  invalidError: any;
  cardDetailsFilledOut: any;
  extraData: any;
  countryid!: string | null | any;
  updatedcountryid!: string | null | any;
  result: any;
  defaultcardid: any;
  cardList: any;
  customersdata: any;
  profileboolean!: boolean;
  profileurl!: string;
  createForm(): void {
    this.createUser = this.fb.group({
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
      countryname: ["", Validators.required],
      countrycode: ["", Validators.required],
      number: ["", [Validators.required, Validators.pattern("[0-9 ]{10}")]],
    });
  }
  ngOnInit() {
    this.getcode();
    this.createForm();
    this.getUserList();
    this.dataSource = new MatTableDataSource(this.UserList);
  }
  constructor(
    private userservice: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private stripeScriptTag: StripeScriptTag,
    private countryservice: CountriesService,
    private http: HttpClient
  ) {}
  openDialog(val: any) {
    const dialogData: DialogData = {
      title: "Assign Vehicle Service",
      id: val._id,
      customerid: val,
    };

    const dialogRef: MatDialogRef<CardsComponent> = this.dialog.open(
      CardsComponent,
      {
        width: "600px",
        height: "auto",
        data: dialogData,
      }
    );

    dialogRef.componentInstance.dialogClosed.subscribe((data: string) => {});
  }
  getcode() {
    this.countryservice.getCountryList2().subscribe((result) => {
      const data = result;
      this.countrycodelist = data;
    });
  }
  selectedCountry(event: any) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "country-id"
    );
    this.countryid = selectedOptionId;
    this.updatedcountryid = selectedOptionId;
    this.countrycodelist.filter((element: any) => {
      if (element.countryname == selectedOption.value) {
        this.createUser.patchValue({
          countrycode: element.countrycode,
        });
      }
    });
  }

  getUserList() {
    this.userservice
      .GetUser(this.page, this.tableSize, this.sort)
      .subscribe((result) => {
        this.data2 = result;
        this.UserList = this.data2.data;
        this.count = this.data2.count;
        if (this.count == 0) {
          this.nouser = true;
          this.addlist = false;
        }
      });
  }

  button() {
    this.value = !this.value;
    this.createUser.reset();
    this.adduser = true;
    this.updateuser = false;
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
  AddUser(val: any) {
    if (this.createUser.valid) {
      const fd = new FormData();
      fd.append("profile", this.profile);
      fd.append("name", val.name);
      fd.append("email", val.email);
      fd.append("number", val.number);
      fd.append("countryid", this.countryid);
      fd.append("countrycode", val.countrycode);
      this.userservice.AddUser(fd).subscribe(
        (result) => {
          this.createUser.controls["profile"].setErrors({ incorrect: false });
          this.data = result;
          this.value = false;
          this.getUserList();
          this.toastr.success("Added Successfully!!!", "");
          if (this.inputValue == "" || this.inputValue == undefined) {
            this.addlist = true;
            this.nouser = false;
          } else {
            this.searchlist = true;
            this.nouser = false;
          }
          this.profileboolean = false;
          this.profileurl = "";
        },
        (error: HttpErrorResponse) => {
          this.errmsg = error.error;
          this.toastr.error(this.errmsg, "");
        }
      );
    } else {
      this.validateAllFormFields(this.createUser);
    }
  }
  UpdateUser(val: any) {
    if (this.profile) {
      val.profile = this.profile;
    }
    if (this.createUser.valid) {
      const fd = new FormData();

      fd.append("countryid", this.updatedcountryid);
      fd.append("profile", this.profile);
      fd.append("name", val.name);
      fd.append("email", val.email);
      fd.append("countrycode", val.countrycode);
      fd.append("number", val.number);
      if (this.inputValue == "") {
        this.userservice.UpdateUser(fd, this.id).subscribe(
          (result) => {
            this.getUserList();
            this.value = false;
            this.toastr.info("Updated Successfully....");
            this.profileboolean = false;
            this.profileurl = "";
          },
          (error: HttpErrorResponse) => {
            this.errmsg = error.error;
            this.toastr.error(this.errmsg, "");
          }
        );
      } else {
        this.userservice.UpdateUser(fd, this.id).subscribe(
          (result) => {
            this.getUserList();
            this.updatesearchlist();
            this.value = false;
            this.toastr.info("Updated Successfully....");
          },
          (error: HttpErrorResponse) => {
            this.errmsg = error.error;
            this.toastr.error(this.errmsg, "");
          }
        );
      }
    } else {
      this.validateAllFormFields(this.createUser);
    }
  }

  EditUser(val: any) {
    this.id = val._id;
    this.value = true;
    this.adduser = false;
    this.updateuser = true;
    this.userservice.EditUser(val._id).subscribe((result) => {
      this.edituser = result;

      this.updatedcountryid = this.edituser.countryid._id;
      this.createUser.patchValue({
        name: this.edituser.name,
        email: this.edituser.email,
        countrycode: this.edituser.countryid.countrycode,
        number: this.edituser.number,
        countryname: this.edituser.countryid.countryname,
      });
    });
  }
  deleteUser(val: any) {
    const del = confirm("Do You Want To Delete it??");

    if (
      (del == true && this.inputValue == undefined) ||
      this.inputValue == ""
    ) {
      this.userservice.deleteUser(val.id).subscribe((result) => {
        this.value = false;
        if (this.UserList.length == 1) {
          if (this.page != 1) {
            this.page -= 1;
          } else {
            this.getUserList();
            this.nouser = true;
            this.searchlist = false;
            this.addlist = false;
            // this.nodriver = false;
          }
        }
        this.getUserList();
        this.createUser.reset();
        this.toastr.error("Deleted Successfully....");
        // }
      });
    } else if (
      (del == true && this.inputValue != "") ||
      this.inputValue != ""
    ) {
      this.userservice.deleteUser(val.id).subscribe((result) => {
        this.value = false;
        if (Object.keys(this.SearchUserList).length == 1) {
          if (this.page2 != 1) {
            this.page2 -= 1;
          } else {
            this.nouser = true;
            this.searchlist = false;
            this.addlist = false;
          }
        }
        // this.searchdriver(0);
        this.updatesearchlist();
        // this.getDriversList();
        this.createUser.reset();
        this.toastr.error("Deleted Successfully....");
      });
    } else {
      this.getUserList();
      this.updatesearchlist();
    }
  }
  cancel() {
    this.createUser.reset();
    this.value = false;
    this.profileboolean = false;
    this.profileurl = "";
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
    this.page = event;
    this.getUserList();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getUserList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  updateuserlist() {
    //
    if (this.searchkey != undefined) {
      this.userservice
        .SearchUser(this.searchkey, this.page2, this.tableSize2, this.sort)
        .subscribe((result) => {
          this.data4 = result;
          if (this.data4.user == "") {
            this.searchlist = false;
            this.nouser = true;
          } else {
            this.data3 = result;
            this.searchlist = this.data3.user;
            this.count2 = this.data3.count;
          }
        });
    }
  }

  searchuser(val: any) {
    this.searchlist = true;
    this.addlist = false;
    this.nouser = false;
    if (val != 0) {
      this.searchkey = val;
    }
    if (val != "") {
      if (val != 0) {
        this.userservice
          .SearchUser(val, this.page2, this.tableSize2, this.sort)
          .subscribe((result) => {
            console.log(result);

            this.data3 = result;
            if (this.data3.user == "") {
              this.searchlist = false;
              this.nouser = true;
            }
            this.SearchUserList = this.data3.user;
            this.count2 = this.data3.count;
          });
      } else {
        this.userservice
          .SearchUser(val, this.page2, this.tableSize, this.sort)
          .subscribe((result) => {
            this.data4 = result;
            if (this.data4.user == "") {
              this.searchlist = false;
              this.nouser = true;
            } else {
              this.data3 = result;
              this.SearchUserList = this.data3.user;
              this.count2 = this.data3.count;
            }
          });
      }
    } else {
      // this.nouser = true;
      this.searchlist = false;
      this.addlist = true;
    }
  }
  cancelsearch() {
    this.searchlist = false;
    this.addlist = true;
    this.inputValue = "";
    this.nouser = false;
    if (this.inputValue != "") {
      this.searchuser(0);
    }
  }
  sorting(val: any) {
    this.sort = val.value;
    this.getUserList();
  }
  updatesearchlist() {
    if (this.searchkey != null) {
      this.userservice
        .SearchUser(this.searchkey, this.page2, this.tableSize2, this.sort)
        .subscribe((result) => {
          this.data4 = result;
          if (this.data4.user == "") {
            this.searchlist = false;
            this.nouser = true;
          } else {
            this.data3 = result;
            this.searchlist = true;
            this.SearchUserList = this.data3.user;
            this.count2 = this.data3.count;
          }
        });
    }
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

  ordering(val: any) {
    this.sort = val.value;
    this.getUserList();
  }
}
