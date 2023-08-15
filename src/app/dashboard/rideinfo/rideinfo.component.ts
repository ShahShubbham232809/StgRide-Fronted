import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Inject,
  NgZone,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { CreaterideService } from "src/Services/createride.service";
@Component({
  selector: "app-rideinfo",
  template: `
    <div class="container">
      <div class=" m-3 p-2">
        <label class="label">Ride Details : </label>
        <div>
          <p>Starting Point : {{ details.startLocation }}</p>
          <p>Drop Point : {{ details.endLocation }}</p>
          <p *ngIf="details.wayPoints != null">
            Way Points :
            <span *ngFor="let waypoint of details.wayPoints">
              {{ waypoint.location }}
            </span>
          </p>
          <p>Total Distance : {{ details.totalDistance }}Kms</p>
          <p>Total Time: {{details.totalTime / 60 | number: '1.0-0' }}Hrs {{details.totalTime % 60 | number: '1.0-0'}}Mins</p>
          <p>Total Price : ₹{{ details.estimateFare }}</p>
          <p>Service Type : {{ details.serviceType }}</p>
          <p>RideTime : {{ details.rideTime }}</p>
          <p>RideDate : {{ details.rideDate }}</p>
          <p>Payment Option : {{ details.paymentOption }}</p>
        </div>
        <label class="label">User Details :</label>
        <div class="d-flex justify-content-center">
          <img
            src="http://127.0.0.1:5000/user/{{ details.userId.profile }}"
            alt=""
            style="width: 45px; height: 45px;"
            class="rounded-circle m-auto"
          />
        </div>
        <p>Name : {{ details.userId.name }}</p>
        <p>Email : {{ details.userId.email }}</p>
        <p>Number : {{ details.userId.countrycode + details.userId.number }}</p>
        <div *ngIf="details.driverID != null">
          <label class="label">Driver Details :</label>
          <div class="d-flex justify-content-center">
            <img
              src="http://127.0.0.1:5000/driver/{{ details.driverID.profile }}"
              alt=""
              style="width: 45px; height: 45px;"
              class="rounded-circle m-auto"
            />
          </div>
          <p>Name : {{ details.driverID.name }}</p>
          <p>Email : {{ details.driverID.email }}</p>
          <p>
            Number :
            {{ details.driverID.countrycode + details.driverID.number }}
          </p>
          <p *ngIf="details.DriverProfit != null">DriverProfit:
          ₹{{ details.DriverProfit }}
          </p>
        </div>
        <div id="map"></div>
        <!-- <div id="map"></div> -->
      </div>

      <div class="d-flex justify-content-center">
        <button
          mat-button
          mat-dialog-close
          class="btn btn-success btn-rounded m-2"
        >
          Close
        </button>
      </div>
    </div>
  `,
  styleUrls: ["./rideinfo.component.scss"],
})
export class RideinfoComponent implements OnInit {
  id: any;
  details: any;
  map!: google.maps.Map;
  userLocation: any;
  @Output() dialogClosed = new EventEmitter<string>();
  startinglocation: any;
  ridedata: any;
  destinationlocation: any;
  geocoder!: google.maps.Geocoder;
  // zone: any;
  startingplace: any;
  destinationplace: any;
  polyline!: google.maps.Polyline;
  waypoints: any;
  directionsService: any;
  directionsRenderer: any;
  async ngOnInit() {
    this.id = this.data.id;

    this.GetRideDetails();
    this.initmap();
  }
  constructor(
    public dialogRef: MatDialogRef<RideinfoComponent>,
    private toaster: ToastrService,
    private http: HttpClient,
    private rideservice: CreaterideService,
    @Inject(MAT_DIALOG_DATA) public data: RideData,
    private zone: NgZone
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }
  GetRideDetails() {
    this.rideservice.EditRide(this.id).subscribe((result) => {
      this.details = result;


      this.drawPath();
    });
  }
  initmap() {
    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 22.3039, lng: 70.8022 },
        zoom: 8,
      }
    );
  }
  drawPath() {


    this.startinglocation = this.details.startLocation;

    this.destinationlocation = this.details.endLocation;



    this.waypoints = this.details.wayPoints ? this.details.wayPoints : [];

    this.geocoder = new google.maps.Geocoder();
    this.geocodeAddress(this.startinglocation, "start");
    this.geocodeAddress(this.destinationlocation, "destination");
  }

  geocodeAddress(address: string, type: string): void {
    this.geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === "OK" && results.length > 0) {
        this.zone.run(() => {
          if (type === "start") {
            this.startingplace = results[0].geometry.location;
          } else if (type === "destination") {
            this.destinationplace = results[0].geometry.location;
          } else if (type === "waypoints") {
            this.waypoints.push(results[0].geometry.location);
          }

          if (this.startingplace && this.destinationplace) {
            this.drawPolyline();
          }
        });
      } else {
        console.error("Geocode was not successful " + status);
      }
    });
  }

  drawPolyline() {
    const request = {
      origin: this.startingplace,
      destination: this.destinationplace,
      optimizeWaypoints: true,
      waypoints: this.waypoints ? this.waypoints : [],
      travelMode: "DRIVING",
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === "OK") {

        this.directionsRenderer.setDirections(result);
        this.directionsRenderer.setMap(this.map);
      } else {
        console.error("Directions request failed due to " + status);
      }
    });

  }
}
export interface RideData {
  title: string;
  id: String;
}
