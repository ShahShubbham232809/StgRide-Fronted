import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CreaterideService } from "src/Services/createride.service";
import { Loader } from "@googlemaps/js-api-loader";
import { SettingService } from "src/Services/setting.service";
import { ToastrService } from "ngx-toastr";
import { CityserviceService } from "src/Services/cityservice.service";
import { elementAt } from "rxjs";
import { VehicletypeService } from "src/Services/vehicletype.service";
import { CarpriceService } from "src/Services/carprice.service";
declare var google: any;
import { io } from "socket.io-client";
import { SocketService } from "../../../../Services/socket.service";
@Component({
  selector: "app-createride",
  templateUrl: "./createride.component.html",
  styleUrls: ["./createride.component.scss"],
})
export class CreaterideComponent implements OnInit {
  duaration: any;
  distance: any;
  origin!: string;
  destination!: string;
  map: any;
  marker: any;
  marker1: any;
  polyline: any;
  cord1: any;
  cord2: any;
  countrycodelist: any;
  createUserRide!: FormGroup;
  CreateUserDetails!: FormGroup;
  createDistance!: FormGroup;
  createride!: FormGroup;
  userdetails: any = false;
  gotDetails: any = true;
  data: any;
  nouser: any = false;
  distancemap: any = false;
  user: any = true;
  userLocation: any;
  marker2: any;
  waypointlocation1: any;
  cord2way: any;
  waypoint2input: any = false;
  marker3: any;
  waypointlocation2: any;
  cord3way: any;
  total = 0;
  totaldistance = 0;
  totaltime = 0;
  addstopcount: any = 0;
  datastop: any;
  stopcount: any;
  waypointcount = [];
  stops!: Number[];
  maxSize = 0;
  autocomplete: any;
  autocomplete_to: any;
  place_name: any;
  citylist: any;
  availabelcordinates: any[] = [];
  list: any;
  data2: any;
  latitude: any;
  longitude: any;
  availbalecity: any = true;
  waypointlist: any[] = [];
  // Declare variables for markers
  sourceMarker!: google.maps.Marker;
  destinationMarker!: google.maps.Marker;
  waypointMarkers: google.maps.Marker[] = [];
  startMarker: any;
  endMarker: any;
  waypointscords: any[] = [];
  rideready: any = false;
  carTypeList: any[] = [];
  totalDistanceKm: any;
  totalDurationMintues: any;
  selectcar: any = false;
  ridecity: any;
  cityid: any;
  data3: any;
  vehiclepricelist: any;
  citycancel: any = false;
  readyforride: any = false;
  readyforcity: any = false;
  estimatedfare: any[] = [];
  estimate: any = false;
  date: any = false;
  userid: any;
  estimatedcarprice: any;
  vehicleid: any;
  countryName: any;
  code: any;
  options: any;
  countryCode: any;
  cardpayment!: boolean;
  selectedCountryCode: any;
  driverprofit!: number;
  timevalue: any;
  startingboolean!: boolean;
  startinglocation: any;
  ridedata: any;
  destinationlocation: any;
  geocoder!: google.maps.Geocoder;
  // zone: any;
  startingplace: any;
  destinationplace: any;
  waypointsgeocode: any;
  constructor(
    private createrideservice: CreaterideService,
    private settings: SettingService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private cityservice: CityserviceService,
    private vehicleservice: VehicletypeService,
    private vehicleprice: CarpriceService,
    private socketservice: SocketService,
    private router: Router,
    private zone: NgZone
  ) {}
  ngOnInit() {
    this.createForm();
    this.createForm2();
    this.createForm3();
    this.createForm4();
    this.getCode();
    this.initmap();
    this.getAddStopValue();
    this.getcordinates();
  }
  getCity(val: any) {
    this.cityid = "";
    this.cityservice.FindCity(val).subscribe((result) => {
      this.data3 = result;
      if (this.data3 != "") {
        this.readyforcity = true;
        this.cityid = this.data3[0]._id;
        this.countryName = this.data3[0].countryid.countryname;
        this.autochanges();
        if (this.cityid) {
          this.getvhiclecitydetails(this.cityid);
        }
      } else {
        this.readyforcity = false;
      }
    });
  }
  datechecker(val: any) {
    const selectedDate = new Date(val.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      this.toastr.info("Selected date in the Past");
      val.value = "";
    }
  }
  getvhiclecitydetails(val: any) {
    this.vehicleprice.GetCityDetails({ val }).subscribe((result) => {
      this.vehiclepricelist = result;
      if (this.vehiclepricelist != "") {
        this.readyforride = true;
        this.getVehicle(this.vehiclepricelist);
      } else {
        this.readyforride = false;
      }
    });
  }
  cityonrock() {
    // this.vehiclepricelist = ''
    // this.availbalecity = true
    setTimeout(() => {
      if (this.cord1 == undefined || this.cord1 == null) {
        this.toastr.info("Please Select Details From Autocomplete API");
        this.createDistance.reset();
        this.initmap();
        this.createDistance.get("droppoint")?.disable();
      } else {
        const placeLatitude = this.cord1.lat();
        const placeLongitude = this.cord1.lng();
        setTimeout(() => {
          // Place cordinates (retrieved from the Autocomplete API)
          let isWithinPolygon = false;
          let matchingCoordinateGroup = null;
          for (const polygon of this.availabelcordinates) {
            let isInside = false;
            let j = polygon.cordinates.length - 1;

            for (let i = 0; i < polygon.cordinates.length; i++) {
              if (
                ((polygon.cordinates[i].lng < placeLongitude &&
                  polygon.cordinates[j].lng >= placeLongitude) ||
                  (polygon.cordinates[j].lng < placeLongitude &&
                    polygon.cordinates[i].lng >= placeLongitude)) &&
                polygon.cordinates[i].lat +
                  ((placeLongitude - polygon.cordinates[i].lng) /
                    (polygon.cordinates[j].lng - polygon.cordinates[i].lng)) *
                    (polygon.cordinates[j].lat - polygon.cordinates[i].lat) <
                  placeLatitude
              ) {
                isInside = !isInside;
              }
              j = i;
            }

            if (isInside) {
              isWithinPolygon = true;
              matchingCoordinateGroup = polygon;
              this.ridecity = matchingCoordinateGroup;
              this.getCity(this.ridecity);
              break;
            }
            // Check if the place cordinates fall within any of the polygons
          }
          setTimeout(() => {
            if (
              isWithinPolygon &&
              this.readyforcity &&
              this.readyforride &&
              placeLatitude &&
              placeLongitude
            ) {
              this.toastr.success("Service is Available in this Area!!");
              this.createDistance.get("droppoint")?.enable();
            } else {
              this.toastr.error("Service is not Available in this Area!!");
              this.createDistance.reset();
              this.initmap();
              this.createDistance.get("droppoint")?.disable();
            }
          }, 400);
        }, 400);
      }
    }, 500);

    // Place cordinates (retrieved from the Autocomplete API)
  }
  cancelcity() {
    this.citycancel = true;
    this.vehiclepricelist = "";
    this.createDistance.get("droppoint")?.disable();
  }
  getVehicle(val: any) {
    this.carTypeList = [];
    let data = val;

    for (let index = 0; index < data.length; index++) {
      this.carTypeList.push({
        type: data[index].typeid.cartype.toUpperCase(),
        id: data[index].typeid._id,
      });
    }
  }
  getAddStopValue() {
    this.settings.GetSettings().subscribe((result) => {
      this.data = result;
      this.addstopcount = this.data[0].Stop;
      this.maxSize = this.addstopcount;
    });
  }

  createForm() {
    this.createUserRide = this.fb.group({
      countrycode: ["", Validators.required],
      number: ["", [Validators.required, Validators.pattern("[0-9 ]{10}")]],
    });
  }
  createForm2() {
    this.CreateUserDetails = this.fb.group({
      name: [""],
      email: [""],
      number: [""],
    });
  }
  createForm3() {
    this.createDistance = this.fb.group({
      startingpoint: ["", Validators.required],
      droppoint: [{ value: "", disabled: true }, Validators.required],
      waypoints: this.fb.array([]),
    });
  }
  createForm4() {
    this.createride = this.fb.group({
      paymentOption: ["", Validators.required],
      rideTime: ["", Validators.required],
      serviceType: ["", Validators.required],
      rideDate: ["", Validators.required],
      startLocation: [""],
      endLocation: [""],
      wayPoints: [""],
      totalDistance: [""],
      totalTime: [""],
      estimateFare: [""],
    });
  }
  get waypoints(): FormArray {
    return this.createDistance.get("waypoints") as FormArray;
  }

  checkcard(val: any) {
    const value = val.value;
    console.log(value);

    if (this.cardpayment == false && value == "Card") {
      this.toastr.info("PLEASE ADD YOUR CARD DETAILS!!!!!");
      this.createride.get("paymentOption")?.setValue("");
    }
  }
  // Add a new item to the form array
  addItem() {
    if (this.waypoints.length < this.maxSize) {
      this.waypoints.push(this.fb.control(""));
    } else {
      this.toastr.error("You Have no More Stop!!!", "");
    }
  }

  getcordinates() {
    this.cityservice.GetCordinates().subscribe((result) => {
      this.data2 = result;
      for (const cords of this.data2) {
        this.availabelcordinates.push(cords);
      }
    });
  }
  // Remove an item from the form array
  getCode() {
    this.createrideservice.GetUser().subscribe((result) => {
      this.countrycodelist = result;
      this.selectedCountryCode = this.countrycodelist[0].countrycode;
    });
  }
  GetDetails(val: any) {
    if (this.createUserRide.valid) {
      this.createrideservice
        .GetUserDetails(val.countrycode, val.number)
        .subscribe((result) => {
          if (result != "") {
            this.nouser = false;
            this.data = result;

            this.userdetails = true;
            this.gotDetails = false;
            this.userid = this.data[0]._id;

            if (
              this.data[0].paymentMethodId == null &&
              this.data[0].customerid == null
            ) {
              console.log("null");
              this.cardpayment = false;
            } else {
              this.cardpayment = true;
            }
            this.CreateUserDetails.patchValue({
              name: this.data[0].name,
              email: this.data[0].email,
              number: this.data[0].countrycode + this.data[0].number,
            });
          } else {
            this.toastr.error("User Not Found!!", "");
          }
        });
    } else {
      this.validateAllFormFields(this.createUserRide);
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
  FindDetails(val: any) {
    this.distancemap = true;
    this.user = false;
  }
  initmap() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const center = { lat: 22.6708, lng: 71.5724 };
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: this.userLocation,
        zoom: 12,
      });
    });
  }
  startingpoint() {
    const input = document.getElementById("search-bar") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["formatted_address", "geometry"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      this.origin = place.formatted_address;
      this.cord1 = place.geometry.location;
      this.sourceMarker = new google.maps.Marker({
        position: this.cord1,
        map: this.map,
        title: "Source",
      });
    });
  }
  droppoint() {
    const input_to = document.getElementById(
      "search-bar-to"
    ) as HTMLInputElement;

    const autocomplete_to = new google.maps.places.Autocomplete(
      input_to,
      this.options
    );

    autocomplete_to.setFields(["formatted_address", "geometry"]);

    autocomplete_to.addListener("place_changed", () => {
      const place2 = autocomplete_to.getPlace();
      this.destination = place2.formatted_address;
      this.cord2 = place2.geometry.location;
    });
  }

  clearPolyline() {
    // If the polyline exists, set its map property to null to remove it from the map
    if (this.polyline) {
      this.polyline.setMap(null);
    }
  }

  CalculateDistance(val: any) {
    if (this.createDistance.valid) {
      if (this.readyforcity && this.readyforride) {
        console.log(this.cord2);

        if (this.cord2 != undefined || this.cord2 != null) {
          for (let index = 1; index < Number(this.maxSize) + 1; index++) {
            let input = document.getElementById(
              `waypoint${index}`
            ) as HTMLInputElement;
            if (input != undefined) {
              this.waypointlist.push({
                location: input.value,
              });
            }
          }

          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer();
          const routeRequest = {
            origin: this.origin,
            destination: this.destination,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          if (this.waypointlist.length > 0) {
            (routeRequest as any).waypoints = this.waypointlist;
          }
          directionsService.route(routeRequest, (result: any, status: any) => {
            if (status == "OK") {
              this.waypointlist = []
              this.rideready = true;
              this.distancemap = false;
              this.createDistance.get("droppoint")?.disable();
              directionsRenderer.setDirections(result);
              directionsRenderer.setMap(this.map);
              const myroute = result.routes[0];

              // Extract distance and duration from the route legs
              let totalDistance = 0;
              let totalDuration = 0;
              for (const leg of myroute.legs) {
                totalDistance += leg.distance.value;
                totalDuration += leg.duration.value;
              }
              console.log(totalDuration);

              // Convert distance to kilometers
              this.totalDistanceKm = (totalDistance / 1000).toFixed(2);

              // Convert duration to hours
              this.totalDurationMintues = (totalDuration / 60).toFixed(2);

              this.putdata();
              this.estimatedfareprice(this.vehiclepricelist);
            } else {
              if (status === "ZERO_RESULTS") {
                this.toastr.error("This Route Is Not Available");
                this.waypointlist = [];
              } else {
                this.toastr.error("Select Place Name From Auto Suggestion");
              }
            }
          });
        } else {
          this.toastr.error("Select location from auto suggestion");
        }
      }
    } else {
      this.validateAllFormFields(this.createDistance);
    }
  }

  waypoint(val: any) {
    let cords;
    let input_to = document.getElementById(
      `waypoint${val.id}`
    ) as HTMLInputElement;
    const autocomplete_to = new google.maps.places.Autocomplete(
      val,
      this.options
    );
    autocomplete_to.setFields(["formatted_address", "geometry"]);
    autocomplete_to.addListener("place_changed", () => {
      const place = autocomplete_to.getPlace();
      if (!place.geometry) {
        this.toastr.info("No details available for this address");
        input_to.value = "";
      }
      const place_name = place.formatted_address;
      cords = place.geometry.location;
      this.waypointscords.push(cords);
    });
  }
  autochanges() {
    this.cityservice.getCountryCode(this.countryName).subscribe((result) => {
      this.code = result;
      this.countryCode = this.code[0].cca2;
      if (this.countryCode === "IO") {
        this.options = {
          componentRestrictions: { country: "in" },
          // types: ['(cities)'],
        };
      } else {
        this.options = {
          // types: ['(cities)'],
          componentRestrictions: { country: this.countryCode },
        };
      }
    });
  }
  putdata() {
    const td = String(this.totalDistanceKm) + " kms ";
    const tm =
      String((Number(this.totalDurationMintues)).toFixed(0)) +
      " min ";
    this.createride.patchValue({
      totalTime: tm,
      totalDistance: td,
    });
  }
  selectVehicle(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "type-id"
    );
    this.vehicleid = selectedOptionId;
    this.estimatedfare.filter((result) => {
      console.log(result);

      if (result.type == selectedOption.value) {
        this.estimatedcarprice = result.estimatefare;
        this.driverprofit = result.driverprofit;
      }
    });
  }
  time(val: any) {
    if (val.value == "Now") {
      const currentDateTime = new Date();
      const currentDate = currentDateTime.toISOString().split("T")[0];
      const currentTime = currentDateTime.toTimeString().split(" ")[0];
      this.createride.patchValue({
        rideDate: currentDate,
        rideTime: currentTime,
      });
      this.timevalue = true;
    } else {
      this.timevalue = false;
    }
  }
  estimatedfareprice(val: any) {
    this.estimatedfare = [];
    console.log(val);

    let data = val;
    this.estimate = true;
    for (let index = 0; index < data.length; index++) {
      let ts;
      let BasePrice = Number(data[index].BasePrice);
      let DistancePrice = Number(data[index].DistancePrice);
      let BasePriceDistance = Number(data[index].BasePriceDistance);
      let totalDistance = this.totalDistanceKm;
      let totalDuration = this.totalDurationMintues;
      let TimePrice = Number(data[index].TimePrice);
      let MinFarePrice = Number(data[index].MinFarePrice);
      let dp = Number(data[index].DriverProfit);

      ts = +(
        (totalDistance - BasePriceDistance) * DistancePrice +
        totalDuration * TimePrice +
        BasePrice
      );
      // this.driverprofit = ts * (dp/100)
      if (ts < MinFarePrice) {
        ts = +MinFarePrice;
        // this.driverprofit = ts * (dp/100)
      } else if (ts < BasePrice) {
        ts = +BasePrice;
      }
      this.estimatedfare.push({
        type: data[index].typeid.cartype.toUpperCase(),
        estimatefare: ts.toFixed(2),
        driverprofit:ts*(dp/100),
      });
    }
  }
  BookRide(val: any) {
    if (val.ridedate <= Date.now()) {
      this.toastr.info("Please Select Time and Date Properly!!");
    }
    if (this.createride.valid) {
      val.startLocation = this.origin;
      val.endLocation = this.destination;
      val.wayPoints = this.waypointlist;
      val.totalDistance = this.totalDistanceKm;
      val.totalTime = this.totalDurationMintues;
      val.userId = this.userid;
      val.vehicleId = this.vehicleid;
      val.cityId = this.cityid;
      val.estimateFare = this.estimatedcarprice;
      val.DriverProfit = this.driverprofit.toFixed(0);
      // if(this.waypointlist.length != this.maxSize){
      this.socketservice.emit("createride", val);
      this.socketservice
        .onDataReceived("createrided-data")
        .subscribe((result) => {
          this.toastr.success("Ride Booked", "");
          this.rideready = false;
          this.distancemap = false;
          this.user = true;
          this.userdetails = false;
          this.gotDetails = true;
          this.createUserRide.reset();
          this.createDistance.reset();
          this.createride.reset();
          this.CreateUserDetails.reset();
          this.initmap();
          this.waypointlist = [];
          this.carTypeList = [];
          this.router.navigate(["/dashboard/confirmride"]);
        });
    } else {
      this.timevalue = false;
      this.validateAllFormFields(this.createride);
    }
    // }else{
    //   this.toastr.warning('Enter One WayPoints.....')
    // }
  }
  resetuser() {
    this.createUserRide.reset();
    this.userdetails = false;
    this.gotDetails = true;
    this.getCode();
  }
  resetdistance() {
    this.distancemap = false;
    this.user = true;
    this.resetuser();
  }

  cancelride() {
    this.rideready = false;
    this.distancemap = true;
    this.createride.reset();
    this.createDistance.reset();
    this.waypoints.clear();
    this.initmap();
    this.origin = "";
    this.destination = "";
    this.cord1 = null;
    this.cord2 = null;
  }
}
