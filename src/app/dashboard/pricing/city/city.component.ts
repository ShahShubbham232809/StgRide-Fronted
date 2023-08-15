import { Component, OnInit } from "@angular/core";
import { CountriesService } from "src/Services/countries.service";
import { Loader } from "@googlemaps/js-api-loader";
import { CityserviceService } from "src/Services/cityservice.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import booleanIntersects from "@turf/boolean-intersects";
import { polygon } from "@turf/helpers";

declare var google: any;

@Component({
  selector: "app-city",
  templateUrl: "./city.component.html",
  styleUrls: ["./city.component.scss"],
})
export class CityComponent implements OnInit {
  addcity: any = false;
  countryList: any;
  country: any;
  normal: any = true;
  edit: any = false;
  update_id: any;
  btn = document.getElementById("add");
  city: any;
  createcity!: FormGroup;
  coordinates: any = [];
  updatedcoordinates: any = [];
  citylist: any;
  value: any = false;
  input: HTMLElement | null | undefined;
  cityname: any;
  map: any;
  options: any;
  polygon: any;
  polygon2: any;
  place: any;
  isInside: boolean = false;
  marker: any;
  selectedShape: any;
  countryName: any;
  drawingManager!: google.maps.drawing.DrawingManager;
  drawingManager2!: google.maps.drawing.DrawingManager;
  path: any;
  code: any;
  countryCode: any;
  details: any;
  countryid: any;
  update: any = false;
  datacity: any;
  countrypolygons: any;
  polygons!: [];
  cord1: any;
  placevalue !: boolean;
  constructor(
    private countryservice: CountriesService,
    private cityservice: CityserviceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}
  getCountryList() {
    this.countryservice.getCountryList2().subscribe((result) => {
      this.countryList = result;
    });
  }
  getCityDetails() {
    this.cityservice.getCityList().subscribe((result) => {
      this.citylist = result;
    });
  }
  wantaddcity() {
    this.value = !this.value;
    this.normal = true;
    this.edit = false;
    this.drawingManager.setDrawingMode(null);
    this.initmap()
    this.createcity.get("countryname")?.enable();
    this.createcity.reset()
  }

  createForm() {
    this.createcity = this.fb.group({
      countryid: [""],
      countryname: [{ disabled: false }, Validators.required],
      cityname: ["", Validators.required],
      coordinates: [""],
    });
  }
  autochanges(val: any, number: any) {
    this.drawingManager.setOptions({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        draggable: true,
      },
    });
    this.boundMapByCountry(val.value);
    if (number == 1) {
      this.countryName = val.value;
    } else {
      this.countryName = val;
    }
    this.cityservice.getCountryCode(this.countryName).subscribe((result) => {
      this.code = result;
      this.countryCode = this.code[0].cca2;
      if (this.countryCode === "IO") {
        this.options = {
          componentRestrictions: { country: "in" },
          types: ["(cities)"],
        };
      } else {
        this.options = {
          types: ["(cities)"],
          componentRestrictions: { country: this.countryCode },
        };
      }
    });
  }
  ngOnInit() {
    this.createForm();
    this.getCountryList();
    this.getCityDetails();
    this.initmap();
    this.createcity.get("cityname")?.disable();
    // this.initmap();
  }
  AddCity(val: any) {
    this.normal = true;
    this.edit = false;

    if (
      this.createcity.valid &&
      this.coordinates.length !== 0 &&
      this.countryid && this.placevalue
      ) {
        const isInside = google.maps.geometry.poly.containsLocation(
          this.cord1,
          this.polygon
        );
      if(isInside){
      val.cordinates = this.coordinates;
      val.countryid = this.countryid;
      this.cityservice.AddCity(val).subscribe((result) => {
        console.log("input", result);
        this.datacity = result;
        if (this.datacity?.keyPattern?.cityname == 1) {
          this.createcity.controls["cityname"].setErrors({ incorrect: true });
        } else {
          // if(this.createVehicle.valid)
          this.createcity.controls["cityname"].setErrors({ incorrect: false });
          console.log(result);
          this.coordinates = [];
          this.createcity.reset();
          this.getCityDetails();
          this.value = false;
          this.toastr.success("City Added!!", "");
          this.drawingManager.unbindAll();
          this.polygon.setMap(null);
          this.polygons = [];
          this.initmap();
          this.createcity.get("cityname")?.disable();
        }
      });}
      else{
        this.toastr.info("Please Draw Proper Zone in Map!!", "");
        // this.createcity.reset
        this.polygon.setMap(null)
      }
    } else {
      this.toastr.error("Please Select Zone!!", "");
      this.validateAllFormFields(this.createcity);
    }
  }
  EditCity(val: any) {
    console.log(val);
    if(this.polygon){
    this.polygon.setMap(null);
    }
    this.createcity.get("countryname")?.disable();
    // this.createcity.get('cityname')?.disable();
    this.update = true;
    console.log(this.update);
    this.updatedcoordinates = [];
    console.log(this.coordinates);

    this.value = true;
    this.edit = true;
    this.normal = false;
    const id = val.id;
    console.log(id);

    this.cityservice.EditCity(id).subscribe((result) => {
      console.log(result);

      this.details = result;
      this.countryid = this.details.countryid._id;
      this.update_id = this.details._id;
      this.autochanges(this.details.countryid.countryname, 2);
      const bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < this.details.cordinates.length; i++) {
        bounds.extend(
          new google.maps.LatLng(
            this.details.cordinates[i].lat,
            this.details.cordinates[i].lng
          )
        );
      }
      this.map.fitBounds(bounds);
      const polygonOptions = {
        path: this.details.cordinates,
        editable: true,
        draggble: true,
      };

      this.polygon = new google.maps.Polygon(polygonOptions);
      this.polygon.setMap(this.map);
      this.drawingManager.setDrawingMode(null);
      this.drawingManager2 = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
      });
      this.drawingManager.setOptions({
        drawingControl: false,
      });
      this.updatedcoordinates = this.details.cordinates;
      google.maps.event.addListener(this.polygon.getPath(), "set_at", () => {
        this.updatedcoordinates = [];
        updateCoordinates();
      });
      google.maps.event.addListener(this.polygon.getPath(), "mouseup", () => {
        // handle vertex changes
        this.updatedcoordinates = [];
        updateCoordinates();
      });
      google.maps.event.addListener(this.polygon.getPath(), "insert_at", () => {
        // handle vertex changes
        this.updatedcoordinates = [];
        updateCoordinates();
      });
      google.maps.event.addListener(this.polygon.getPath(), "remove_at", () => {
        // handle vertex changes
        this.updatedcoordinates = [];
        updateCoordinates();
      });
      const updateCoordinates = () => {
        // Get path of selected shape
        this.updatedcoordinates = [];
        var path = this.polygon.getPath();

        // Loop through path and add each coordinate to array
        for (var i = 0; i < path.length; i++) {
          this.updatedcoordinates.push({
            lat: path.getAt(i).lat(),
            lng: path.getAt(i).lng(),
          });
        }

        // Log the coordinates to the console
        console.log(this.updatedcoordinates);
      };
      this.createcity.patchValue({
        countryname: this.details.countryid.countryname,
        cityname: this.details.cityname,
      });
      this.getCityDetails();
    });
  }
  deleteCity(val: any) {
    const id = val.id;
    this.cityservice.deleteCity(id).subscribe((result) => {
      this.getCityDetails();
      this.polygon.setMap(null);
      this.createcity.reset();
      this.value = false;
      this.createcity.get("cityname")?.enable();
    });
  }
  AddAutoCity() {
    const input = document.getElementById("input");
    const autocomplete = new google.maps.places.Autocomplete(
      input,
      this.options
    );
    autocomplete.setFields(["formatted_address", "geometry"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("No details available for input: ", place.name);
        this.toastr.info('Please Enter Proper Address!!', '');
        this.placevalue = false
        return;
      }
      this.placevalue = true
      this.cityname = place.formatted_address;
      this.cord1 = place.geometry.location;
      const placeid = place.place_id;
      const featureLayer = this.map.getFeatureLayer('LOCALITY');

      // Define a style with purple fill and border.
      //@ts-ignore

      // Apply the style to a single boundary.
      const featureStyleOptions: google.maps.FeatureStyleOptions = {
        strokeColor: '#810FCB',
        strokeOpacity: 1.0,
        strokeWeight: 3.0,
        fillColor: '#810FCB',
        fillOpacity: 0.5
      };
      //@ts-ignore
      featureLayer.style = (options: { feature: { placeId: string; }; }) => {
        if (options.feature.placeId == 'ChIJ0zQtYiWsVHkRk8lRoB1RNPo') { // Hana, HI
          return featureStyleOptions;
        }
      };

      // Update map with selected location
      this.createcity.patchValue({
        cityname: this.cityname,
      });
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(8);
      this.marker.setPosition(place.geometry.location);
    });
    this.updatedcoordinates = [];
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
  updateCity(val: any) {
    this.update = true;
    console.log(this.update);

    console.log(val);
    if (this.coordinates != "") {
      this.updatedcoordinates = this.coordinates;
    }
    if (this.edit == true) {
      google.maps.event.addListener(this.polygon.getPath(), "set_at", () => {
        updateCoordinates();
      });
      google.maps.event.addListener(this.polygon.getPath(), "insert_at", () => {
        updateCoordinates();
      });
      const updateCoordinates = () => {
        // Get path of selected shape
        this.updatedcoordinates = [];
        var path = this.polygon.getPath();

        // Loop through path and add each coordinate to array
        for (var i = 0; i < path.length; i++) {
          this.updatedcoordinates.push({
            lat: path.getAt(i).lat(),
            lng: path.getAt(i).lng(),
          });
        }

        // Log the coordinates to the console
        console.log(this.updatedcoordinates);
      };

      val.cordinates = this.updatedcoordinates;
      val.countryid = this.countryid;
      // if(this.placevalue){
      this.cityservice.updateCity(val, this.update_id).subscribe((result) => {
        this.polygon.setMap(null);
        this.getCityDetails();
        this.updatedcoordinates = [];
        this.createcity.reset();
        this.toastr.info("City Updated!!", "");
        this.normal = true;
        this.edit = false;
        this.value = false;
        this.update = false;
        this.initmap();
        this.createcity.get("cityname")?.disable();
      });
    // }else{
    //   this.toastr.info("Please Select City!!", "");
    // }
    } else {
      this.edit = true;
    }
  }
  initmap() {
    if (this.edit != true) {
      const center = { lat: 22.6708, lng: 71.5724 };

      this.map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 8,
        mapId: 'a3efe1c035bad51b',
      });
        this.marker = new google.maps.Marker({
          position: center,
          map: this.map,
          title: "Your location",
        });
        this.drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: false,
          drawingModes: [],
          polygonOptions: {
            editable: true,
            draggable: true,
          },
        });
        this.drawingManager.setMap(this.map);
        google.maps.event.addListener(
          this.drawingManager,
          "overlaycomplete",
          (event: any) => {
            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
              if (this.polygon) {
                this.polygon.setMap(null); //clearing old drawn polygon
              }
              this.polygon = event.overlay;
            }
            // Get polygon shape and its path
            this.polygon = event.overlay;
            this.path = this.polygon.getPath();
            // Save reference to selected shape for editing
            this.selectedShape = this.polygon;
            // Add listener to get lat/lng values of shape when it is edited
            google.maps.event.addListener(
              this.polygon.getPath(),
              "set_at",
              function () {
                console.log("set");
                updateCoordinates();
              }
            );
            google.maps.event.addListener(
              this.polygon.getPath(),
              "insert_at",
              function () {
                console.log("insert");
                updateCoordinates();
              }
            );
            google.maps.event.addListener(
              this.polygon.getPath(),
              "remove_at",
              function () {
                console.log("remove");

                updateCoordinates();
              }
            );

            // this.drawingManager.setDrawingMode(null)
            // this.drawingManager.setOptions({
            //   drawingControl:false,
            //   // drawingMode:true
            // })
            // Update coordinates for the first time
            updateCoordinates();
          }
        );
        const updateCoordinates = () => {
          // Get path of selected shape
          var path = this.selectedShape.getPath();
          this.coordinates = [];
          // Loop through path and add each coordinate to array
          for (var i = 0; i < path.length; i++) {
            this.coordinates.push({
              lat: path.getAt(i).lat(),
              lng: path.getAt(i).lng(),
            });
          }
          // Log the coordinates to the console
          console.log(this.coordinates);

          // this.drawingManager.setDrawingMode()

          // this.drawingManager2.setDrawingMode(null)
        };
      // });
    }
  }
  selectedCountry(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "country-id"
    );
    this.countryid = selectedOptionId;
    console.log(selectedOption);
    this.cityservice
      .getPolygons({ countryid: this.countryid })
      .subscribe((result) => {
        console.log(result);
        this.createcity.get("cityname")?.enable();
        this.countrypolygons = result;
        console.log(this.countrypolygons);
        this.polygons = this.countrypolygons.map((country: any) => {
          let cordinates = country.cordinates;
          return { cordinates };
        });
        console.log(this.polygons);
        this.polygons.forEach((coords: any) => {
          console.log(coords);

          this.polygon = new google.maps.Polygon({
            paths: coords.cordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          });

          this.polygon.setMap(this.map);
        });
      });
  }
  cancel() {
    this.createcity.reset();
    this.normal = false;
    this.edit = false;
    this.value = false;
    this.marker.setMap(null);
    this.polygon.setMap(null);
    this.createcity.get("cityname")?.disable();
    this.initmap()
  }
  updateautocomplete() {
    if (this.polygon) {
      this.polygon.setMap(null);
    }
    this.drawingManager.setOptions({
      drawingControl: true,
      // drawingMode:true
    });
  }
  boundMapByCountry(countryName: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: countryName }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          this.map.fitBounds(results[0].geometry.viewport);
          this.map.setZoom(5);
        }
      } else {
        console.log(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  }
}
