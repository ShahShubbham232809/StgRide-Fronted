import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CountriesService } from "src/Services/countries.service";

@Component({
  selector: "app-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.scss"],
})
export class CountryComponent implements OnInit {
  countries: any = [];
  value: any = false;
  CreateCountry!: FormGroup;
  countryData: any;
  currency: any;
  name: any;
  data: any;
  countryList: any;
  searchCountryList: any;
  search: any = false;
  normal: any = true;
  nofound: any = false;
  nodata: any;
  searchbtn: any;
  ngOnInit() {
    this.createForm();
    this.getCountry();
    this.getCountryList();
  }
  addCountry() {
    this.value = !this.value;
  }
  constructor(
    private countryService: CountriesService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}
  createForm() {
    this.CreateCountry = this.fb.group({
      flag: ["", Validators.required],
      flagpath: ["", Validators.required],
      countryname: ["", Validators.required],
      countrytimezone: ["", Validators.required],
      countrycode: ["", Validators.required],
      currency: ["", Validators.required],
    });
  }
  getCountryList() {
    this.countryService.getCountryList2().subscribe((result) => {
      this.countryList = result;
    });
  }

  getCountry() {
    this.countryService.getCountryList().subscribe((result) => {
      this.countries = result;
      this.countries.sort((a: any, b: any) =>
        a.name.common.localeCompare(b.name.common)
      );
    });
  }
  createCon(val: any) {
    if (this.CreateCountry.valid) {
      this.countryService.AddCountry(val).subscribe((result) => {
        this.data = result;
        if (this.data?.keyPattern?.countryname == 1) {
          this.CreateCountry.controls["countryname"].setErrors({
            incorrect: true,
          });
        } else {
          this.getCountryList();
          this.value = false;
          this.toastr.success("Added Successfully!!!", "");
          this.CreateCountry.controls["countryname"].setErrors({
            incorrect: false,
          });
          this.CreateCountry.reset();
        }
      });
    } else {
      this.toastr.warning("Please Select Country!!", "");
      this.validateAllFormFields(this.CreateCountry);
    }
  }

  searchCountry(val: any) {
    this.value = false;
    this.searchCountryList = null;
    if (val == "") {
      this.search = false;
      this.normal = true;
    } else {
      this.countryService.SearchCountry(val).subscribe((result) => {
        this.nodata = result;
        if (this.nodata == "") {
          this.nofound = true;
          this.normal = false;
          this.search = false;
        } else {
          this.nofound = false;
          this.searchCountryList = result;
          this.normal = false;
          this.search = true;
        }
      });
    }
  }

  add(val: any) {
    this.countryService.getCountry(val).subscribe((result) => {
      this.countryData = result;
      if (this.countryData[0].name.common != "Antarctica") {
        this.currency = Object.values(this.countryData[0]?.currencies);
        this.CreateCountry.patchValue({
          flag: this.countryData[0].flag,
          flagpath: this.countryData[0].flags.svg,
          countryname: this.countryData[0].name.common,
          countrytimezone: this.countryData[0].timezones[0],
          countrycode:
            this.countryData[0].idd?.root +
            this.countryData[0].idd?.suffixes[0],
          currency: this.currency[0].symbol + " " + this.currency[0].name,
        });
      } else {
        this.toastr.warning("country not found", "");
      }
    });
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

  deleteCountry(val: any) {
    this.countryService.deleteCountry(val.id).subscribe((result) => {
      this.toastr.info("Deleted Successfully!!!", "");
      this.CreateCountry.reset();
      this.getCountryList();
    });
  }
  cancel(val: any) {
    this.search = false;
    this.nofound = false;
    this.normal = true;
    this.searchCountryList = null;
    val.value = "";
  }
  cancelcountry() {
    this.value = false;
    this.CreateCountry.reset();
  }
}
