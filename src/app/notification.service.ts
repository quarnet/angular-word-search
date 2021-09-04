import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  appMessages: string[] = [];
  constructor() {}

  addMessage(message: string) {
    this.appMessages.push(message);
  }

  remove(ind: number) {
    this.appMessages.splice(ind, 1);
  }

  clear() {
    this.appMessages = [];
  }
}
