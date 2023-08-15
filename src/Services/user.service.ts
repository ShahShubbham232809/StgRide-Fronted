import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/internal/operators/map";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // countryCallingCodes : any
  constructor(private http: HttpClient) {}
  apiUrl = "https://restcountries.com/v3.1/all";
  apiUrl2 = "https://stgride.onrender.com/userslist/";

  getCountryList() {
    return this.http.get(this.apiUrl);
  }
  AddUser(val: any) {
    return this.http.post(this.apiUrl2 + "list", val);
  }
  GetUser(page: any, limit: any, sort: any) {

    return this.http.post(this.apiUrl2 + "list/paginate", {
    page:page,limit:limit,sort:sort
    });
  }
  EditUser(editcar: any) {
    return this.http.get(this.apiUrl2 + "list/edit/user/" + editcar);
  }
  deleteUser(deletecar: any) {
    return this.http.delete(this.apiUrl2 + "list/" + deletecar);
  }
  UpdateUser(updateuserdata: any, id: any) {
    return this.http.post(this.apiUrl2 + "list/" + id, updateuserdata);
  }
  SearchUser(key: any, page: any, limit: any, sort: any) {
    return this.http.get(
      this.apiUrl2 + "/search/" + key + "/" + page + "/" + limit + "/" + sort
    );
  }
}
