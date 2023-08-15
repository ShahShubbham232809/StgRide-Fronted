import { Injectable } from '@angular/core';
import { timer, takeUntil } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class IdletimeService {

  private activityTimeout: number = 1000000; // 10 minute
  private activityTimer: any;
  private activitySubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.setupIdleTimer();
  }

  private setupIdleTimer(): void {
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keydown', this.resetTimer.bind(this));
    this.startTimer();
  }

  private resetTimer(): void {
    clearTimeout(this.activityTimer);
    this.startTimer();
  }

  private startTimer(): void {
    this.activityTimer = setTimeout(() => {
      this.activitySubject.next(true);
    }, this.activityTimeout);
  }

  public onIdleTimeout(): Observable<boolean> {
    return this.activitySubject.asObservable();
  }
}
