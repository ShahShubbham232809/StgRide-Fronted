import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'jquery';
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { NgxFileDropEntry } from "ngx-file-drop";
import { ToastrService } from "ngx-toastr";
import { UserdataService } from "src/Services/userdata.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  createuser!: FormGroup;
  token: any;
  data: any;
  errmsg: any;
  // toastr: any;
  constructor(
    private fb: FormBuilder,
    private newUser: UserdataService,
    private cookie: CookieService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
  }
  profile: any;
  inputProfile(event: any) {
    this.profile = event.target.files[0];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
    if (this.profile.size > maxSizeInBytes) {
      // alert('File size exceeds the limit of 5MB.');
      // Reset the file input if needed
      this.toastr.info('Image Size is Very Large..')
      event.target.value = null;
    }else if (!allowedTypes.includes(this.profile.type)) {
      this.toastr.info('Invalid Format..')
      // Reset the file input if needed
      event.target.value = null;
    }
  }

  createForm() {
    this.createuser = this.fb.group({
      profile: [""],
      firstname: ["", [Validators.required, Validators.minLength(4)]],
      lastname: ["", [Validators.required, Validators.minLength(4)]],
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      number: [
        "",
        [Validators.required, Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/)],
      ],
    });
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  create(val: any) {
    const fd = new FormData();
    fd.append("profile", this.profile);
    fd.append("firstname", val.firstname);
    fd.append("lastname", val.lastname);
    fd.append("email", val.email);
    fd.append("password", val.password);
    fd.append("number", val.number);
    if (this.createuser.valid) {
      this.newUser.registartion(fd).subscribe(
        (result) => {
        this.data = result;
        this.toastr.success("Register Successfully!!!", "");
        this.token = result;
        this.cookie.set("jwt", this.token);
        this.router.navigate(["dashboard/login"]);
      },
      (error:HttpErrorResponse)=>{
        this.errmsg = error.error;
        this.toastr.error(this.errmsg, "");
      }
      );
    } else {
      this.validateAllFormFields(this.createuser);
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
