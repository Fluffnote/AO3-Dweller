import { Component, OnInit } from '@angular/core';
import {
  IonBackButton, IonButton,
  IonButtons,
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonItem, IonLabel, IonNavLink,
  IonRefresher, IonRefresherContent, IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Work} from '../../data/models/work';
import {AO3} from '../../data/handlers/ao3';
import {WorkParser} from '../../data/parsers/work-parser';
import {DecimalPipe, NgClass} from '@angular/common';
import {RefresherCustomEvent} from '@ionic/angular';
import {WorkViewMetadataComponent} from './work-view-metadata/work-view-metadata.component';
import {Browser} from '@capacitor/browser';
import {DropDownHTMLComponent} from '../../UI/drop-down-html/drop-down-html.component';
import {SQL} from '../../data/DB/sql';
import {logger} from '../../data/handlers/logger';
import {WorkPipeline} from '../../data/handlers/class/work-pipeline';
import {HideOverlayDirective} from '../../UI/hide-header.dir';
import {UIHoldToCopyDirective} from '../../UI/hold-to-copy.dir';
import {BackButtonComponent} from '../../UI/back-button/back-button.component';
import {History} from '../../data/models/history';
import {Chapter} from '../../data/models/chapter';
import {HistoryMgmt} from '../../data/handlers/history-mgmt';
import {HideHeaderComponent} from '../../UI/hide-header/hide-header.component';
import {StatusBumperComponent} from '../../UI/status-bumper/status-bumper.component';

@Component({
    selector: 'views-work-view',
    templateUrl: './work-view.component.html',
    styleUrls: ['./work-view.component.less'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonRefresher,
    IonRefresherContent,
    WorkViewMetadataComponent,
    IonButton,
    IonIcon,
    DropDownHTMLComponent,
    IonFab,
    IonFabButton,
    IonSpinner,
    IonNavLink,
    IonItem,
    IonLabel,
    RouterLink,
    HideOverlayDirective,
    UIHoldToCopyDirective,
    BackButtonComponent,
    NgClass,
    HideHeaderComponent,
    StatusBumperComponent,
  ]
})
export class WorkViewComponent  implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private ao3: AO3,
    private workPipe: WorkPipeline,
    private router: Router,
    private historyMgmt: HistoryMgmt
  ) { }

  workParser = new WorkParser();
  workId: string | null = null;
  work: Work | null = null;

  hideHeader: boolean = false;

  bookmarked: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.grabWork();
    })
  }

  handleRefresh(event: RefresherCustomEvent) {
    if (this.workId != null) this.workPipe.get(Number(this.workId), 2).subscribe(work => {
      this.work = work;
      event.target.complete();
    })
  }

  toggleBookmark() {
    this.bookmarked = !this.bookmarked
  }

  openWebPage() {
    Browser.open({ url: "https://archiveofourown.org/works/"+this.workId+"?view_adult=true" });
  }

  grabWork() {
    if (this.workId != null) {
      this.workPipe.get(Number(this.workId), 1).subscribe(work => {
        this.work = work;
      })
    }
  }

  chapterComplete(history: History | null) {
    if (history == null) return "";
    return history.scrollPosition >= history.scrollMax? "complete" : "";
  }

  openChapter(chapter: Chapter) {
    if (chapter.history != null && (chapter.history.scrollPosition >= chapter.history.scrollMax)) {
      this.historyMgmt.resetPos(this.work!.id, chapter.id)
    }
    this.router.navigate(['/work/' + this.work!.id + '/chapter/' + chapter.id]);
  }

}
