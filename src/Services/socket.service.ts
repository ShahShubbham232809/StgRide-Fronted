  import { Injectable } from '@angular/core';
import { data } from 'jquery';
  import { Observable,fromEvent } from 'rxjs';
  import { io, Socket } from 'socket.io-client';
import { NavigateService } from './navigate.service';
  @Injectable({
    providedIn: 'root',
  })
  export class SocketService {
    private socket !: Socket;
    private url = 'http://localhost:5000/';
    update: any;
    constructor(
      private navigate:NavigateService
    ) {
      this.socket = io(this.url);
    }

    public emit(eventName: string, data: any): void {
      this.socket.emit(eventName, data);
    }

    public onDataReceived(eventName: string): Observable<any> {
      return new Observable<any>((observer) => {
        this.socket.on(eventName, (data: any) => {
          observer.next(data);
        });
      });
    }
    getstatus(val:any){
      return val
    }

    public onmethod(){
      return this.socket
    }



  }
