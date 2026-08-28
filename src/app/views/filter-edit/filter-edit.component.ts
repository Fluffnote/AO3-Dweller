import { Component, OnInit } from '@angular/core';
import {HideHeaderComponent} from '../../UI/hide-header/hide-header.component';
import {HideOverlayDirective} from '../../UI/hide-header.dir';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonInput, IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonSelect,
  IonSelectOption, IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {StatusBumperComponent} from '../../UI/status-bumper/status-bumper.component';
import {RefresherCustomEvent} from '@ionic/angular';
import {BackButtonComponent} from '../../UI/back-button/back-button.component';
import {WorkInfoComponent} from './work-info/work-info.component';
import {WorkTagsComponent} from './work-tags/work-tags.component';
import {WorkStatsComponent} from './work-stats/work-stats.component';
import {SearchSettingsComponent} from './search-settings/search-settings.component';
import {WorkFilter} from './../../data/models/filters/work-filter'
import {logger} from '../../data/handlers/logger'
import {Filter, SavedFilter} from '../../data/models/filters/filter';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-filter-edit',
  templateUrl: './filter-edit.component.html',
  styleUrls: ['./filter-edit.component.less'],
  imports: [
    HideHeaderComponent,
    HideOverlayDirective,
    IonContent,
    IonHeader,
    IonToolbar,
    StatusBumperComponent,
    IonTitle,
    BackButtonComponent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSegmentView,
    IonSegmentContent,
    IonSelect,
    IonSelectOption,
    IonInput,
    WorkInfoComponent,
    WorkTagsComponent,
    WorkStatsComponent,
    SearchSettingsComponent
  ]
})
export class FilterEditComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  hideHeader: boolean = false;

  filter: SavedFilter = new SavedFilter();

  temp: boolean = false;

  ngOnInit() {
    this.filter.settings = new WorkFilter();
    this.route.queryParams.subscribe((params) => {
      // logger.info(JSON.stringify(params));
      this.temp = params['temp'] as boolean || false;
      let filter = JSON.parse(params['filter']) as Filter || null;

      if (filter.searchBase === "works/search") { // @ts-ignore
        this.filter.settings.copyFrom(JSON.parse(params['filter']) as WorkFilter)
        logger.info(JSON.stringify(this.filter.settings));
      }
    });
  }

  testOut() {
    logger.info("FILTER: "+JSON.stringify(this.filter.settings));
    // @ts-ignore
    // logger.info(JSON.stringify(this.filter.settings.paramMap()));
  }

  search() {
    this.testOut()
    this.router.navigate(['/main/search'], {
      queryParams: {
        filter: JSON.stringify(this.filter.settings),
        advancedFilter: true
      },
      queryParamsHandling: 'merge'
    });
  }

  protected readonly WorkFilter = WorkFilter;
}
