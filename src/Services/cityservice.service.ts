import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityserviceService {


  apiUrl = 'https://stgride.onrender.com/cities/'
  apiUrl2 = 'https://restcountries.com/v3.1/name/'
  constructor(private http:HttpClient) { }
  getCityList(){
    return this.http.get(this.apiUrl+'list')
  }

  getCountryCode(val:any){

    const country = val.toString()
    return this.http.get(this.apiUrl2+val)
  }
  AddCity(NewCity:any) {
    return this.http.post(this.apiUrl+'list', NewCity)
  }

  deleteCity(deletecity:any){
    return this.http.delete(this.apiUrl+'list/'+deletecity)
  }

  GetCordinates(){
    return this.http.get(this.apiUrl+'list/cordinates')
  }
  getPolygons(val:any){
    return this.http.post(this.apiUrl+'list/polygons',val)
  }
  EditCity(editcity:any){
    return this.http.get(this.apiUrl+'list/edit/'+editcity)
  }
  updateCity(editcity:any,id:any){
    return this.http.post(this.apiUrl+'list/'+id,editcity)
  }
  getSelectCity(country:any){
    return this.http.get(this.apiUrl+'list/country/'+country)
  }

  FindCity(cordinates:any) {
    return this.http.post(this.apiUrl+'list/foundcity/cordinates', cordinates)
  }


}
