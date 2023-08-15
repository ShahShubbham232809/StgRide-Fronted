import { Injectable, OnInit } from "@angular/core";
import { NavigateService } from "./navigate.service";

@Injectable({
  providedIn: "root",
})
export class PushnotificationService implements OnInit {
  count = 0;
  constructor(private navigate: NavigateService) {}
  requestNotificationPermission(): void {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }

  sendNotification(message: string): void {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Stg Solutions", {
        body: message,
        vibrate: [200, 100, 200],
        icon: "/assets/logo/logo-black.svg",
      });
    }
  }
  ngOnInit(): void {}
}
