import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  apiUrl = 'http://localhost:5000/settings/list'
  constructor(private http:HttpClient) {

  }
  GetSettings(){
    return this.http.get(this.apiUrl)
  }

  AddRideTime(val:any){
    return this.http.post(this.apiUrl+'ridetime',val)
  }
  AddStop(val:any){
    return this.http.post(this.apiUrl+'addstop',val)
  }

  AddSettings(val:any,id:any){
    return this.http.post(this.apiUrl+'/'+id,val)
  }
}
