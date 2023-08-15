import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

import { Observable } from 'rxjs';
import { UserdataService } from 'src/Services/userdata.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  value: boolean = false;
  constructor(private user:UserdataService,private router:Router){

  }
  canActivate() {
    this.value = this.user.isLoginIn()
    if(this.value == true){
      // this.router.navigate(['dashboard'])
      return true;
    }else{
      this.router.navigate(["login"])
      return false
    }
  }
  
}
