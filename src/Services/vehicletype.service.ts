import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'jquery';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicletypeService {

  apiUrl = 'https://stgride.onrender.com/car/'
  constructor(private http:HttpClient) {

  }
  getCarList(){
    return this.http.get(this.apiUrl+'list')
  }
  AddCarType(NewCar:any) {
    return this.http.post(this.apiUrl + 'list', NewCar)
  }
  EditCar(editcar:any){
    return this.http.get(this.apiUrl+'list/edit/'+editcar)
  }
  deleteCar(deletecar:any){
    return this.http.delete(this.apiUrl+'list/'+deletecar)
  }
  Updatecar(updatecardata:any,id:any){
    return this.http.post(this.apiUrl+'list/'+id,updatecardata)
  }

}
