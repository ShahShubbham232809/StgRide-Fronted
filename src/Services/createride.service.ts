import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CreaterideService implements OnInit{
  createUserRide!: FormGroup;
  apiUrl = 'https://stgride.onrender.com/userslist/';
  apiUrl2 = 'https://stgride.onrender.com/createride/'
  constructor(private http: HttpClient, private fb: FormBuilder) {}
  ngOnInit(){

  }

  GetUser() {
    return this.http.get(this.apiUrl + 'list/');
  }
  GetUserDetails(countrycode:any,number:any){
    return this.http.get(this.apiUrl + 'list'+'/'+countrycode+'/'+number)
  }
  AddRide(val:any){


    return this.http.post(this.apiUrl2 + 'list',val)
  }
  GetRides(page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl2+'list/'+page+'/'+limit+'/'+sort)
  }
  GetRideHistory(page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl2+'ridehistory/'+page+'/'+limit+'/'+sort)
  }
  deleteRide(deletecar:any){
    return this.http.delete(this.apiUrl2+'list/'+deletecar)
  }
  SearchRide(key:any,page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl2+'search/'+key+'/'+page+'/'+limit+'/'+sort)
  }
  SearchRideHistory(key:any,page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl2+'searchridehistory/'+key+'/'+page+'/'+limit+'/'+sort)
  }
  SearchRideHistoryByFilter(key:any,page:any,limit:any,sort:any){
    return this.http.post(this.apiUrl2+'searchridehistorybyfilter/'+page+'/'+limit+'/'+sort,key)
  }
  SearchRideHistoryByFilterInConfirm(key:any,page:any,limit:any,sort:any){
    return this.http.post(this.apiUrl2+'searchridehistorybyfilterinconfirm/'+page+'/'+limit+'/'+sort,key)
  }
  EditRide(editcar:any){
    return this.http.get(this.apiUrl2+'list/edit/'+editcar)
  }
}
