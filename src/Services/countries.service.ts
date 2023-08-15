import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {


  apiUrl = 'https://restcountries.com/v3.1/all?fields=name'
  apiUrl2 = 'https://restcountries.com/v3.1/name/'
  apiUrl3 = 'https://stgride.onrender.com/countries/'
  constructor(private http:HttpClient) {

  }
  getCountryList(){
    return this.http.get(this.apiUrl)
  }
  getCountry(key:any){
    return this.http.get(this.apiUrl2+key+'?fullText=true')
  }
  getCountryList2(){
    return this.http.get(this.apiUrl3+'list')
  }
  AddCountry(NewCountry:any) {
    return this.http.post(this.apiUrl3+'list', NewCountry)
  }

  deleteCountry(deletecountry:any){
    return this.http.delete(this.apiUrl3+'list/'+deletecountry)
  }

  SearchCountry(key:any){
    return this.http.get(this.apiUrl3+'search/'+key)
  }


}
