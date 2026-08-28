import {Component, OnInit, ViewChild} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent,
  IonSearchbar, IonSpinner,
  IonToolbar
} from '@ionic/angular/standalone';
import {HomeViewComponent} from '../../home-view/home-view.component';
import {Search} from '../../../data/handlers/search';
import {Work} from '../../../data/models/work';
import {DecimalPipe} from '@angular/common';
import {SearchCardComponent} from '../../../UI/search-card/search-card.component';
import {logger} from '../../../data/handlers/logger';
import {ActivatedRoute, Router} from '@angular/router';
import {InfiniteScrollCustomEvent} from '@ionic/angular';
import {Keyboard} from '@capacitor/keyboard';
import {HideOverlayDirective} from '../../../UI/hide-header.dir';
import {HideHeaderComponent} from '../../../UI/hide-header/hide-header.component';
import {StatusBumperComponent} from '../../../UI/status-bumper/status-bumper.component';
import {WorkFilter} from '../../../data/models/filters/work-filter';
import {Filter} from '../../../data/models/filters/filter';

@Component({
  selector: 'views-search-sub-view',
  templateUrl: './search-sub-view.component.html',
  styleUrls: ['./search-sub-view.component.less'],
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    HomeViewComponent,
    DecimalPipe,
    SearchCardComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    HideOverlayDirective,
    HideHeaderComponent,
    StatusBumperComponent,
    IonSpinner,
    IonButtons,
    IonButton,
    IonIcon
  ]
})
export class SearchSubViewComponent  implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private search: Search
  ) { }

  @ViewChild("SearchBar") searchBar!: IonSearchbar;

  filter: WorkFilter | null = null;
  advancedFilter = false;

  amountFound: number = -1;
  works: Work[] = [];
  searchEnd: boolean = false;
  loading: boolean = false;

  hideHeader: boolean = false;

  ngOnInit() {
    this.search.amountFound.subscribe(amount => this.amountFound = amount);
    this.search.searchResults.subscribe(works => this.works = works);
    this.search.searchEnd.subscribe(searchEnd => this.searchEnd = searchEnd);

    this.route.queryParams.subscribe((params) => {
      this.advancedFilter = JSON.parse(params['advancedFilter']) as boolean || false;
      let temp = JSON.parse(params['filter']) as Filter || null;
      if (temp == null) this.filter = null;
      else {
        if (temp.searchBase === "works/search") this.filter = JSON.parse(params['filter']) as WorkFilter

        if (this.filter !== null) this.search.search(this.filter as WorkFilter).subscribe(() => {
          this.loading = false;
        });
      }
    });
  }

  openEditor() {
    this.router.navigate(['/filter/-1'], {
      queryParams: {
        temp: true
      },
      queryParamsHandling: 'merge'
    });
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
      else {
        let filter = new WorkFilter();
        filter.query = value as string;

        this.router.navigate(['/main/search'], {
          queryParams: {
            filter: JSON.stringify(filter),
            advancedFilter: false
          },
          queryParamsHandling: 'merge'
        });
        Keyboard.hide();
      }
    }
    else {
      this.amountFound = -1
      this.works = [];
    }
  }

  filterStyle(): string {
    return "color: "+(this.advancedFilter?"#9CFFFA":"white")
  }

  onSearchNext(event: InfiniteScrollCustomEvent) {
    this.search.searchNext().subscribe(() => {
      event.target.complete();
    });
  }

}
