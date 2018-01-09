import { Injectable, EventEmitter } from '@angular/core';
export { Notification } from './notification'

@Injectable()
export class NotificationsService {

  notifyEvent: EventEmitter< Notification > = new EventEmitter();
  constructor() { }

  notify( notification: Notification) {
    console.log('notify', notification)
    //this.notifyEvent.emit(notification)
    this.notifyEvent.next(notification)
  }
}