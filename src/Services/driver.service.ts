import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class DriverService {
  // countryCallingCodes : any
  private socket !: Socket;
  private url = 'https://stgride.onrender.com/';

  constructor(private http:HttpClient) {
    this.socket = io(this.url);
   }
  apiUrl = 'https://restcountries.com/v3.1/all'
  apiUrl2 = 'https://stgride.onrender.com/driverslist/'
  getCountryList(){
    return this.http.get(this.apiUrl)
  }
  AddDriver(val:any){

    return this.http.post(this.apiUrl2+'list',val)
  }
  GetDrivers(page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl2+'list/'+page+'/'+limit+'/'+sort)
  }
  EditDriver(editcar:any){
    return this.http.get(this.apiUrl2+'list/edit/'+editcar)
  }
  deleteDriver(deletecar:any){
    return this.http.delete(this.apiUrl2+'list/'+deletecar)
  }
  UpdateDriver(updateuserdata:any,id:any){
    return this.http.post(this.apiUrl2+'list/'+id,updateuserdata)
  }
  SearchDriver(key:any,page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl2+'/search/'+key+'/'+page+'/'+limit+'/'+sort)
  }
  UpdateServiceType(val:any){
    return this.http.post(this.apiUrl2+'list/service/',val)
  }
  UpdateStatus(id:any,status:any){
    return this.http.post(this.apiUrl2+'list/status/'+id+'/'+status,status)
  }
}
