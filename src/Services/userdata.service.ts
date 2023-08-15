import { trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserdataService {
  value = false;
  logoutuser:any
  apiUrl = 'https://stgride.onrender.com/';
  constructor(private http: HttpClient, private cookie: CookieService) {}
  login(UserData: any) {
    return this.http.post(this.apiUrl + 'login', UserData);
  }
  registartion(NewUser: any) {
    return this.http.post(this.apiUrl + 'registration', NewUser);
  }
  isLoginIn() {
    //
    // this.value = this.cookie.check('jwt')

    if (localStorage.getItem('jwt')) {
      return true;
    } else {
      return false;
    }
  }
  logoutUser(val: any,token:any) {
    this.value = false


    this.logoutuser = JSON.parse(val)
    let formdata = new FormData();
    formdata.append("id",this.logoutuser._id)
    formdata.append("token",token.toString())


    return this.http.post(this.apiUrl + 'logout', formdata);
  }
}
