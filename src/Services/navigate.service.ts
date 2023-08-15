import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  loggedin: EventEmitter<boolean> = new EventEmitter<boolean>();
  loggedout: EventEmitter<boolean> = new EventEmitter<boolean>();
  nav: EventEmitter<boolean> = new EventEmitter<boolean>();
  driver: EventEmitter<boolean> = new EventEmitter<boolean>();
  runningride : EventEmitter<boolean> = new EventEmitter<boolean>();
  notification : EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {

  }

}
