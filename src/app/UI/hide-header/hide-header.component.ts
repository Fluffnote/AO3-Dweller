import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BackButtonComponent} from "../back-button/back-button.component";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {NgClass} from '@angular/common';

@Component({
    selector: 'ui-hide-header',
    templateUrl: './hide-header.component.html',
    styleUrls: ['./hide-header.component.less'],
  imports: [
    BackButtonComponent,
    IonButton,
    IonButtons,
    IonIcon,
    IonTitle,
    IonToolbar,
    NgClass,
    IonRefresher,
    IonRefresherContent
  ]
})
export class HideHeaderComponent {

  constructor() { }

  @Input() hide: boolean = false;
  @Input() allowRefresh: boolean = false;
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  _refresh(event: any) {this.refresh.emit(event);}

}
