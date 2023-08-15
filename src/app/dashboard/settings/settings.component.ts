import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "src/Services/setting.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  ridetime = [10, 20, 30, 45, 60, 90, 120];
  addstope = [1, 2, 3, 4, 5];
  createsettings!: FormGroup;
  id: any;
  settings: any;
  stop: any;

  createform() {
    this.createsettings = this.fb.group({
      Stop: [""],
      TimeOut: [""],
      NodemailerEmail: [""],
      NodemailerPassword: [""],
      StripeSecreteKey: [""],
      StripePublishableKey: [""],
      TwilioAccountid: [""],
      TwilioAuthToken: [""],
    });
  }
  ngOnInit(): void {
    this.GetSettings();
    this.createform();

  }
  constructor(
    private settingservice: SettingService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  GetSettings() {
    this.settingservice.GetSettings().subscribe((result) => {
      console.log(result);

      this.settings = result;
      this.id = this.settings[0]._id;
      this.createsettings.patchValue({
        Stop: this.settings[0].Stop,
        TimeOut: this.settings[0].TimeOut,
        NodemailerEmail: this.settings[0].NodemailerEmail,
        NodemailerPassword: this.settings[0].NodemailerPassword,
        StripeSecreteKey: this.settings[0].StripeSecreteKey,
        StripePublishableKey: this.settings[0].StripePublishableKey,
        TwilioAccountid: this.settings[0].TwilioAccountid,
        TwilioAuthToken: this.settings[0].TwilioAuthToken,
      });
    });
  }
  AddSetting(val: any) {
    this.settingservice.AddSettings(val, this.id).subscribe((result) => {
      this.toastr.info("Updated Successfully!!!!!!");
      this.GetSettings();
    });
  }
}
