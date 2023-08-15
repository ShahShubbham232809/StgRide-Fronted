import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { event } from "jquery";
import { ToastrService } from "ngx-toastr";
import { CarpriceService } from "src/Services/carprice.service";
import { CityserviceService } from "src/Services/cityservice.service";
import { CountriesService } from "src/Services/countries.service";
import { VehicletypeService } from "src/Services/vehicletype.service";

@Component({
  selector: "app-vehicleprice",
  templateUrl: "./vehicleprice.component.html",
  styleUrls: ["./vehicleprice.component.scss"],
})
export class VehiclepriceComponent implements OnInit {
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
  data: any;
  details: any;
  add: any = true;
  edit: any = false;
  updatecity: any;
  updatecountry: any;
  updatetype: any;
  duplicate: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 2;
  page2: number = 1;
  count2: number = 0;
  tableSize2: number = 2;
  inputValue: any;
  data2: any;
  nouser: any;
  sort = "asc";
  createForm() {
    this.createCarPrice = this.fb.group({
      countryid: [{ disable: false }, Validators.required],
      cityid: [{ disable: false }, Validators.required],
      typeid: [{ disable: false }, Validators.required],
      DriverProfit: ["", Validators.required],
      MinFarePrice: ["", Validators.required],
      BasePriceDistance: ["", Validators.required],
      BasePrice: ["", Validators.required],
      DistancePrice: ["", Validators.required],
      TimePrice: ["", Validators.required],
      MaxSpace: ["", Validators.required],
    });
  }
  ngOnInit() {
    this.getCountry();
    this.CarType();
    this.createForm();
    this.getCarPrice();
  }
  constructor(
    private carpriceservice: CarpriceService,
    private countryservice: CountriesService,
    private vehicleservice: VehicletypeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  getCarPrice() {
    this.carpriceservice
      .getCarPriceList(this.page, this.tableSize, this.sort)
      .subscribe((result) => {
        this.data2 = result;
        this.carpricelist = this.data2.data;
        this.count = this.data2.count;
      });
  }

  getCountry() {
    this.countryservice.getCountryList2().subscribe((result) => {
      this.countryList = result;
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getCarPrice();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;

    this.getCarPrice();
  }

  selectedCountry(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "country-id"
    );

    this.countryid = selectedOptionId;
    this.GetCity(selectedOptionId);
  }

  carid(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "data-id"
    );

    this.cityid = selectedOptionId;
  }
  cartypeid(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "type-id"
    );
    this.typeid = selectedOptionId;
  }
  CarType() {
    this.vehicleservice.getCarList().subscribe((result) => {
      this.carTypeList = result;
    });
  }
  Show() {
    this.value = !this.value;
    this.add = true;
    this.edit = false;
    this.cityList = [];
    this.createCarPrice.get("countryid")?.enable();
    this.createCarPrice.get("cityid")?.enable();
    this.createCarPrice.get("typeid")?.enable();
    this.createCarPrice.reset();
  }
  AddCarPrice(val: any) {
    const element = document.getElementById("city");

    if (this.createCarPrice.valid) {
      val.countryid = this.countryid;
      val.cityid = this.cityid;
      val.typeid = this.typeid;
      //
      this.carpriceservice.AddCarPrice(val).subscribe((result) => {
        this.data = result;
        if (this.data == "duplicate") {
          this.toastr.info("Already Exists Data", "");
        } else {
          this.getCarPrice();
          this.value = false;
          this.createCarPrice.reset();
          this.toastr.success("Added Successfully!!!", "");
        }
      });
    } else {
      this.validateAllFormFields(this.createCarPrice);
    }
  }
  Cancel() {
    this.createCarPrice.reset();
    this.value = false;
  }
  EditCarPrice(val: any) {
    this.createCarPrice.get("countryid")?.disable();
    this.createCarPrice.get("cityid")?.disable();
    this.createCarPrice.get("typeid")?.disable();
    this.id = val._id;
    this.add = false;
    this.edit = true;
    this.value = true;
    this.GetCity(val.countryid._id);
    this.countryid = val.countryid._id;
    this.cityid = val.cityid._id;
    this.typeid = val.typeid._id;
    this.createCarPrice.patchValue({
      countryid: val.countryid.countryname,
      cityid: val.cityid.cityname,
      typeid: val.typeid.cartype,
      DriverProfit: val.DriverProfit,
      MinFarePrice: val.MinFarePrice,
      BasePriceDistance: val.BasePriceDistance,
      BasePrice: val.BasePrice,
      DistancePrice: val.DistancePrice,
      TimePrice: val.TimePrice,
      MaxSpace: val.MaxSpace,
    });
  }
  DeleteCarPrice(val: any) {
    const deleted = confirm("Do You Want To Delete ???");
    if (deleted == true) {
      this.carpriceservice.deleteCarPrice(val._id).subscribe((result) => {
        if (this.carpricelist.length == 1) {
          if (this.page != 1) {
            this.page -= 1;
          } else {
            this.nouser = true;
          }
        }
        this.getCarPrice();
        this.toastr.error("Deleted Successfully!!!", "");
      });
    }
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
  UpdateCarPrice(val: any) {
    if (val.city == "") {
      this.GetCity(val.country);
    }
    val.countryid = this.countryid;
    val.cityid = this.cityid;
    val.typeid = this.typeid;
    if (this.createCarPrice.valid) {
      this.carpriceservice.UpdatecarPrice(val, this.id).subscribe((result) => {
        this.createCarPrice.get("countryid")?.enable();
        this.createCarPrice.get("cityid")?.enable();
        this.createCarPrice.get("typeid")?.enable();
        this.data = result;
        this.getCarPrice();
        this.value = false;
        this.toastr.success("Updated Successfully!!!", "");
        this.add = true;
        this.edit = false;
        this.createCarPrice.reset();
      });
      // } else {
      //   const update = this.carpricelist.filter((elem: any) => {
      //     if (
      //       elem.countryid == val.countryid &&
      //       elem.cityid == val.cityid &&
      //       elem.typeid == val.typeid
      //     ) {
      //       this.duplicate = true;
      //     }
      //   });
      //

      //   if (this.duplicate == true) {
      //     this.toastr.info("Already Exists Data", "");
      //   } else {
      //     this.carpriceservice
      //       .UpdatecarPrice(val, this.id)
      //       .subscribe((result) => {
      //         this.data = result;
      //         this.getCarPrice();
      //         this.value = false;
      //         this.toastr.success("Updated Successfully!!!", "");
      //         this.add = true;
      //         this.edit = false;
      //         this.createCarPrice.reset();
      //       });
      //   }
      // }
    } else {
      this.validateAllFormFields(this.createCarPrice);
    }
  }
  GetCity(val: any) {
    this.cd.detectChanges();

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
  sorting(val: any) {
    this.sort = val.value;
    this.getCarPrice();
  }
}
