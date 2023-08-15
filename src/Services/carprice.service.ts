import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarpriceService {


  apiUrl = 'http://localhost:5000/vehicleprice/'
  apiUrl2 = 'http://localhost:5000/countries/'
  apiUrl3 = 'http://localhost:5000/cities/'

  constructor(private http:HttpClient) {

  }
  getCarPriceList(page:any,limit:any,sort:any){
    return this.http.get(this.apiUrl+'list/'+page+'/'+limit+'/'+sort)
  }

  GetCityList(country:any) {


    return this.http.get(this.apiUrl3 + 'list/country/'+country)
  }
  EditCarPrice(editcarPrice:any){
    return this.http.get(this.apiUrl+'list/edit/'+editcarPrice)
  }
  deleteCarPrice(deletecarprice:any){
    return this.http.delete(this.apiUrl+'list/'+deletecarprice)
  }
  UpdatecarPrice(updatecardata:any,id:any){
    return this.http.post(this.apiUrl+'list/'+id,updatecardata)
  }
  AddCarPrice(NewCarPrice:any) {
    return this.http.post(this.apiUrl + 'list', NewCarPrice)
  }
  GetCityDetails(Cityname:any){
    return this.http.post(this.apiUrl+'list/cityservicelist',Cityname)
  }

}
