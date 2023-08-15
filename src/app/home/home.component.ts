import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Route } from '@angular/router';
// import { Router } from 'express';
import { AuthGuard } from '../auth.guard';
// import { RouterService } from '../router.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  loggin :any =  false
  constructor(private authservice:AuthGuard,private router:Router){}
  ngOnInit() {
    this.loggin = this.authservice.canActivate()


    // if(this.loggin == true){
    //   this.router.navigate(['dashboard/users'])
    // }else{
    //   this.router.navigate(['login'])
    // }
  }

}
