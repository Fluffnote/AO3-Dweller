import {Component, OnInit, ViewChild} from '@angular/core';
import {
  IonContent,
  IonHeader, IonInfiniteScroll, IonInfiniteScrollContent,
  IonSearchbar, IonSpinner,
  IonToolbar
} from '@ionic/angular/standalone';
import {HomeSubViewComponent} from './home-sub-view/home-sub-view.component';
import {Search} from '../../../data/handlers/search';
import {Work} from '../../../data/models/work';
import {DecimalPipe} from '@angular/common';
import {SearchCardComponent} from '../../../UI/search-card/search-card.component';
import {logger} from '../../../data/handlers/logger';
import {Router} from '@angular/router';
import {InfiniteScrollCustomEvent} from '@ionic/angular';
import {Keyboard} from '@capacitor/keyboard';
import {HideOverlayDirective} from '../../../UI/hide-header.dir';
import {HideHeaderComponent} from '../../../UI/hide-header/hide-header.component';
import {StatusBumperComponent} from '../../../UI/status-bumper/status-bumper.component';

@Component({
  selector: 'views-search-sub-view',
  templateUrl: './search-sub-view.component.html',
  styleUrls: ['./search-sub-view.component.less'],
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    HomeSubViewComponent,
    DecimalPipe,
    SearchCardComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    HideOverlayDirective,
    HideHeaderComponent,
    StatusBumperComponent,
    IonSpinner
  ]
})
export class SearchSubViewComponent  implements OnInit {

  constructor(
    private search: Search,
    private router: Router
  ) { }

  @ViewChild("SearchBar") searchBar!: IonSearchbar;

  amountFound: number = -1;
  works: Work[] = [];
  searchEnd: boolean = false;
  loading: boolean = false;

  hideHeader: boolean = false;

  ngOnInit() {
    this.search.amountFound.subscribe(amount => this.amountFound = amount);
    this.search.searchResults.subscribe(works => this.works = works);
    this.search.searchEnd.subscribe(searchEnd => this.searchEnd = searchEnd);
  }

  onSearchChange(event: Event) {
    this.loading = true;
    let value = (event.target as HTMLIonSearchbarElement).value;
    if (typeof value === "string" && value.length > 0) {
      if (value.includes("/works/")) {
        logger.info("value: "+value);
        let workId = value.substring(value.indexOf("/works/")+7)
        workId = workId.substring(0, workId.search(/[\/?]/));
        this.router.navigate(['/work', workId]);
        this.searchBar.value = "";
      }
      else if (/(work:)\d+/.test(value)) {
        this.router.navigate(['/work', value.replace("work:", "")]);
        this.searchBar.value = "";
      }
      else this.search.searchText(value as string).subscribe(() => {
        Keyboard.hide();
          this.loading = false;
      });
    }
    else {
      this.amountFound = -1
      this.works = [];
    }
  }

  onSearchNext(event: InfiniteScrollCustomEvent) {
    this.search.searchNext().subscribe(() => {
      event.target.complete();
    });
  }

}
