import { Component, OnInit } from '@angular/core';
import {IonContent, IonHeader, IonSpinner, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Work} from '../../../data/models/work';
import {LibraryMgmt} from '../../../data/handlers/library-mgmt';
import {SearchCardComponent} from '../../../UI/search-card/search-card.component';

@Component({
  selector: 'views-library-sub-view',
  templateUrl: './library-sub-view.component.html',
  styleUrls: ['./library-sub-view.component.less'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSpinner,
    SearchCardComponent
  ]
})
export class LibrarySubViewComponent  implements OnInit {

  constructor(private libraryMgmt: LibraryMgmt) { }

  libraryList: Work[] | null = null;

  ngOnInit() {
    this.libraryMgmt.updateLibraryList();
    this.libraryMgmt.libraryList.subscribe(list => this.libraryList = list);
  }

}
