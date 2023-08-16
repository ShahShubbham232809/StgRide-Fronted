import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { VehicletypeService } from "src/Services/vehicletype.service";
import { VehiclepriceComponent } from "../pricing/vehicleprice/vehicleprice.component";

@Component({
  selector: "app-dialog",
  template: `
    <div class="p-2">
      <h1 mat-dialog-title class="text-center">{{ data.title }}</h1>
      <input type="text" value="{{ data.id }}" #id hidden />
      <div class="center" style="display: flex; justify-content: space-around;">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label p-1">Type</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control has-icons-left">
                <span class="select">
                  <select #cartypevalue (change)="Typeid($event)">
                    <option
                      *ngFor="let car of vehicleList"
                      [value]="car.cartype"
                      [attr.data-id]="car._id"
                      class="bg-light"
                    >
                      {{ car.cartype | uppercase}}</option
                    >
                  </select>
                </span>
                <span class="icon is-small is-left">
                  <i class="fas fa-car"></i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div mat-dialog-actions class="d-flex justify-content-around">
        <button mat-button mat-dialog-close class="btn btn-info btn-rounded">
          Close
        </button>
        <button
          class="btn btn-info btn-rounded"
          (click)="assignvehicle(id.value)"
        >
          Assign
        </button>
      </div>
    </div>
  `,
})
export class DialogComponent implements OnInit {
  vehicleList: any;
  vehicletype: any;
  typeid: any;
  @Output() dialogClosed = new EventEmitter<string>();
  assignvehicle(id: any) {
    console.log(id);
    if (!this.typeid) {
      console.log(this.typeid);
      this.typeid = this.vehicleList[0]._id;
    }
    this.vehicletype = { id: id, typeid: this.typeid };
    this.dialogClosed.emit(this.vehicletype);
    this.dialogRef.close();
  }
  vehiclelist() {
    this.cartype.getCarList().subscribe((result) => {
      this.vehicleList = result;
    });
  }
  Typeid(event: Event) {
    const selectedOption = event.target as HTMLSelectElement;
    const selectedOptionId = selectedOption.selectedOptions[0].getAttribute(
      "data-id"
    );
    this.typeid = selectedOptionId;
  }
  ngOnInit() {
    this.vehiclelist();

  }
  constructor(
    private cartype: VehicletypeService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}

export interface DialogData {
  title: string;
  id: String;
  // message: string;
}
