import { Component, OnInit } from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {logger} from '../../../data/handlers/logger';
import {Router} from '@angular/router';

@Component({
  selector: 'views-filters-sub-view',
  templateUrl: './filters-sub-view.component.html',
  styleUrls: ['./filters-sub-view.component.less'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class FiltersSubViewComponent  implements OnInit {

  constructor(private router: Router) { }

  out = ""

  ngOnInit() { }

  openEditor(filterId: number) {
    this.router.navigate(['/filter/-1']);
  }

}
