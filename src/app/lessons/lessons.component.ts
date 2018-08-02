import {Component, OnInit} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Observable} from "rxjs/Observable";
import {Lesson} from "../model/lesson";
import {SwPush} from "@angular/service-worker";
import {NewsletterService} from "../services/newsletter.service";

@Component({
    selector: 'lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    lessons$: Observable<Lesson[]>;
    isLoggedIn$: Observable<boolean>;

    sub: PushSubscription;

    // public key for notification server (visible in browser)
    readonly VAPID_PUBLIC_KEY = "BCHL5CPv5M5xjNWDCNfQNzBXRk2d-bX2cO8xw92_yKJlVHHMylclH265IvQimJ3bkErZz8EmctpA747mRNbN2cQ";
    //,"privateKey":"EGGzENBdfHlwppz1Ie8q9zer_-xRJCRFLlzO8sKJa90"}"

    constructor(
        private lessonsService: LessonsService,
        private swPush: SwPush,
        private newsletterService: NewsletterService) {
    }

    ngOnInit() {
        this.loadLessons();
    }

    loadLessons() {
        this.lessons$ = this.lessonsService.loadAllLessons().catch(err => Observable.of([]));
    }

    subscribeToNotifications() {
      // request notification subscription
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        // if sub object exist, button will be disabled
        this.sub = sub;
        console.log('Notification subscription: ', sub);
        // call newsletter service
        this.newsletterService.addPushSubscriber(sub).subscribe(
          () => console.log('Sent push subscription to the server'),
          err => console.log('Could not send push subscription to the server', err)
        );
      })
      .catch(err => console.error('Could not subscribe to notifications', err));
    }

    sendNewsletter() {
      //console.log('sending Newsletter');
      // call newsletter service
      this.newsletterService.send().subscribe();
    }





}
