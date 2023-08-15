import { Injectable, Injector } from '@angular/core';
import {AuthGuard} from './auth.guard';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private inject:Injector,private authguard:AuthGuard) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authservice = this.inject.get(AuthGuard)
    const newRequest = request.clone({
    setHeaders:{
      Authorization:'stg'+authservice.canActivate()
    }
    })
    return next.handle(newRequest);
  }
}
