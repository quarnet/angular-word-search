import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass'],
})
export class NotificationComponent implements OnInit {
  constructor(public notification: NotificationService) {}

  close(index: number) {
    this.notification.remove(index);
  }
  ngOnInit(): void {}
}
