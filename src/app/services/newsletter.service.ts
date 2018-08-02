import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Injectable()
export class NewsletterService {

    constructor(private http: HttpClient) {

    }

    // add subscriber
    addPushSubscriber(sub: any) {
      return this.http.post('/api/notifications', sub);
    }

    // send push notification
    send() {
      return this.http.post('/api/newsletter', null);
    }

}


