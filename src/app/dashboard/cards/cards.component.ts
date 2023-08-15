import { data } from "jquery";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { loadStripe } from "@stripe/stripe-js";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "src/Services/setting.service";

@Component({
  selector: "app-cards",
  template: `
    <div class="card m-3">
      <div *ngIf="cardlist">
        <!-- <div ngIf="cardlist"> -->
        <div class="row m-2 p-2" *ngFor="let card of cardList">
          <div class="card p-1 globebox">
            <span
              class="badge badge-pill badge-success position-absolute px-2"
              *ngIf="card.id == defaultcardid"
              >Default</span
            >
            <div class="example-button-container">
              <button
                mat-fab
                color="warn"
                aria-label="Example icon button with a delete icon"
                (click)="DeleteCard(card.id)"
                style="position:absolute;right:0px;height:30px;width:30px;font-size: 10px;margin:5px;top:8px;"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <div class="d-flex justify-content-center align-center">
              <div
                class="align-center w-50 d-flex justify-content-center align-center"
              >
                <img
                  src="../assets/logo/visa.svg"
                  alt=""
                  class="img-thumbnail card border border-success p-1"
                  style="height: 60px;width:120px;margin:auto 0;"
                />
              </div>
              <div class="text-center w-50">
                <p>xxxx xxxx xxxx {{ card.card.last4 }}</p>
                <p>Expiration Month: {{ card.card.exp_month }}</p>
                <p>Expiration Year: {{ card.card.exp_year }}</p>
                <!-- Add more card details as needed -->
              </div>
            </div>
            <div class="text-center" *ngIf="card.id != defaultcardid">
              <div class="example-button-container">
                <button
                  mat-fab
                  color="basic"
                  aria-label="Example icon button with a bookmark icon"
                  style="position:absolute;right:0px;height:30px;width:30px;font-size: 10px;margin:5px;top:55px;background-color:lightgreen"
                  (click)="SetDefault(card.customer, card.id)"
                >
                  <mat-icon>account_balance</mat-icon>
                </button>
              </div>
            </div>

            <!-- <button
              class="btn btn-danger btn-rounded m-2"
              (click)="DeleteCard(card.id)"
            >
              Delete
            </button> -->
          </div>
        </div>
        <!-- </div> -->
        <input type="text" value="{{ data.id }}" #id hidden />
      </div>
      <form id="payment-form">
        <div id="card-element">
          <!-- Elements will create form elements here -->
        </div>

        <div class="text-center">
          <button
            id="submit"
            class="btn bg-light p-2 px-3 my-2"
            style="box-shadow: lightblue 0px 1px 4px;"
            (click)="AddCardDetails(id)"
            *ngIf="addcard"
          >
            Add
          </button>
          <button
            id="submit"
            class="btn bg-light p-2 px-3 my-2 mx-2"
            style="box-shadow: lightblue 0px 1px 4px;"
            (click)="Cancel()"
            *ngIf="addcard"
          >
            Cancel
          </button>
        </div>

        <div class="text-center">
          <button
            id="submit"
            class="btn bg-light p-2 px-3 my-2"
            style="box-shadow: lightblue 0px 1px 4px;"
            (click)="AddCard(id.value)"
          >
            Add Card
          </button>
          <button
            mat-dialog-close
            class="btn bg-light p-2 px-3 my-2 mx-2"
            style="box-shadow: lightblue 0px 1px 4px;"
          >
            Close
          </button>
        </div>
        <div id="error-message">
          <!-- Display error message to your customers here -->
        </div>
      </form>
      <div></div>
    </div>
  `,
  styleUrls: ["./cards.component.scss"],
})
export class CardsComponent implements OnInit {
  stripe: any;
  @Output() dialogClosed = new EventEmitter<string>();
  form: any;
  messageContainer: any;
  elements: any;
  paymentElement: any;
  handleError: any;
  AddCardUser: any = false;
  addcard: any = false;
  cardList: any;
  Userdata!: DialogData;
  id: any;
  cardlist: any = true;
  result: any;
  defaultcardid: any;
  customersdata: any;
  key: any;
  async ngOnInit() {
    this.id = this.data.id;
    this.getcard();
  }
  constructor(
    public dialogRef: MatDialogRef<CardsComponent>,
    private toaster: ToastrService,
    private http: HttpClient,
    private settings: SettingService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  async AddCard(val: any) {
    this.settings.GetSettings().subscribe(async (result) => {
      this.key = result;
      this.cardlist = false;
      this.stripe = await loadStripe(this.key[0].StripePublishableKey);
      setTimeout(() => {
        // this.vehiclelist()-
        const options = {
          mode: "setup",
          currency: "usd",
          appearance: {},
        };
        // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 3
        this.elements = this.stripe.elements(options);
        this.paymentElement = this.elements.create("payment", {
          layout: {
            type: "accordion",
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: false,
          },
        });
        // Create and mount the Payment Element
        this.paymentElement.mount("#card-element");
      }, 1000);
      this.AddCardUser = true;
      this.addcard = true;
    });
  }
  Cancel()  {
    this.paymentElement.unmount("#card-element");
    this.cardlist = true
    // this.getcard()
    this.addcard = false
    this.AddCardUser = false

  }
  async getcard() {

    if (this.data.customerid.customerid != null) {
      if (this.cardlist) {
        this.http
          .get(`https://stgride.onrender.com/userslist/get-customer/${this.data.id}`)
          .subscribe(
            (data) => {
              console.log(data);

              this.customersdata = data;
              // this.defaultcardid = this.customersdata.invoice_settings.default_payment_method;
            },
            (error) => {
              console.error("Error:", error);
              // Handle the error
            }
          );

      this.http
        .get(`https://stgride.onrender.com/userslist/get-card/${this.id}`)
        .subscribe(
          (data) => {
            console.log(data);

            // Handle the retrieved data
            this.result = data;
            this.defaultcardid = this.result.default;
            this.cardList = this.result.data;
            const len = Object.keys(this.cardlist).length;
          },
          (error) => {
            console.error("Error:", error);
            // Handle the error
          }
        );
      }
    }
  }
  async AddCardDetails(val: any) {
    const { error: submitError } = await this.elements.submit();
    if (submitError) {
      this.handleError(submitError);
      return;
    }

    // Create the SetupIntent and obtain clientSecret
    const res = await fetch(
      `https://stgride.onrender.com/userslist/create-intent/${val}`,
      {
        method: "POST",

      }
    );

    const { client_secret: clientSecret } = await res.json();

    // Confirm the SetupIntent using the details collected by the Payment Element
    const { error } = await this.stripe.confirmSetup({
      elements: this.elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:4200/dashboard/users",
      },
    });

    if (error) {
      console.log(error);
      if(error.code ==  'card_declined'){
        this.toaster.error("Card Declined");
      }

    } else {
      // this.isAddCard = false
      this.toaster.success("Card added successfully!");
      this.AddCardUser = false;
      this.cardlist = true;

    }
  }
  async DeleteCard(val: any) {
    const deletecard = confirm("Are You Want To Delete Card????");
    if (deletecard) {
      this.http
        .get(`https://stgride.onrender.com/userslist/delete-card/${val}`)
        .subscribe(
          (data) => {
            // Handle the retrieved data
            this.getcard();
            this.toaster.error("Deleted Succesfully!!", "");
          },
          (error) => {
            console.error("Error:", error);
            // Handle the error
          }
        );
    }
  }
  async SetDefault(val: any, cardid: any) {
    this.http
      .patch(`https://stgride.onrender.com/userslist/default-card/${val}`, { cardid })
      .subscribe(
        (data) => {
          // Handle the retrieved data
          this.getcard();
        },
        (error) => {
          console.error("Error:", error);
          // Handle the error
        }
      );
  }
}

export interface DialogData {
  title: string;
  id: String;
  customerid: any;
}
