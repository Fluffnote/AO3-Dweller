import { Component, OnInit } from '@angular/core';
import {IonButton, IonChip, IonIcon, IonLabel} from '@ionic/angular/standalone';
import {Browser} from '@capacitor/browser';

@Component({
  selector: 'views-home-sub-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.less'],
  imports: [
    IonButton,
    IonIcon,
    IonChip,
    IonLabel
  ]
})
export class HomeViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  openBrowser(url: string) { Browser.open({url}); }

}
