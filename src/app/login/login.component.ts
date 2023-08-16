import { HttpErrorResponse } from "@angular/common/http";

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserdataService } from "src/Services/userdata.service";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { NavigateService } from "src/Services/navigate.service";
import { ToastrService } from "ngx-toastr";
import { IdletimeService } from "src/Services/idletime.service";
// import { LocalStorageService } from 'ngx-webstorage';

// import { RouterService } from '../router.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  token: any;
  loginuser: FormGroup;
  LoginDetails: any;
  constructor(
    private fb: FormBuilder,
    private loginUser: UserdataService,
    // private cookie: CookieService,
    private router: Router,
    private LogIn: NavigateService,
    private toastr: ToastrService,
    private idle:IdletimeService
  ) // private local

  {
    this.loginuser = fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", Validators.required],
    });
  }
  ngOnInit() {
    if(localStorage.getItem("jwt") != null && localStorage.getItem("user") != null){
      this.LogIn.loggedin.emit(true);
      this.LogIn.loggedout.emit(false);
      this.router.navigate(["dashboard/users"]);
    }
  }
  login(val: any) {
    this.LoginDetails = val;
    if(this.loginuser.valid){
      this.loginUser.login(val).subscribe(
        (result) => {
          this.token = result;
          localStorage.setItem("user", JSON.stringify(this.token.usermail));
          localStorage.setItem("jwt", this.token.token);
          this.LogIn.loggedin.emit(true);
          this.LogIn.loggedout.emit(false);
          this.router.navigate(["dashboard/users"]);
          this.toastr.success("Login Successfully!!!", "");
        },
        (error: HttpErrorResponse) => {
          console.log(error);

          this.toastr.error(error.error);
        }
      );
    }else {
      this.validateAllFormFields(this.loginuser);
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
}
