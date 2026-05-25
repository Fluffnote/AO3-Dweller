import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AO3} from '../../data/handlers/ao3';
import {RefresherCustomEvent} from '@ionic/angular';
import {Browser} from '@capacitor/browser';
import {Chapter} from '../../data/models/chapter';
import {DropDownHTMLComponent} from '../../UI/drop-down-html/drop-down-html.component';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonLabel, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import {ChapterParser} from '../../data/parsers/chapter-parser';
import {logger} from '../../data/handlers/logger';
import {ElementLoadDirective} from '../../UI/element-load.dir';
import {History} from '../../data/models/history';
import {ChapterPipeline} from '../../data/handlers/class/chapter-pipeline';
import {HistoryMgmt} from '../../data/handlers/history-mgmt';
import {HideOverlayDirective} from '../../UI/hide-header.dir';
import {BackButtonComponent} from '../../UI/back-button/back-button.component';
import {NgClass} from '@angular/common';
import {StatusBar} from '@capacitor/status-bar';
import {StatusBumperComponent} from '../../UI/status-bumper/status-bumper.component';
import {HideHeaderComponent} from '../../UI/hide-header/hide-header.component';

@Component({
  selector: 'views-chapter-view',
  templateUrl: './chapter-view.component.html',
  styleUrls: ['./chapter-view.component.less'],
  imports: [
    DropDownHTMLComponent,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonSpinner,
    IonTitle,
    IonToolbar,
    ElementLoadDirective,
    HideOverlayDirective,
    BackButtonComponent,
    IonLabel,
    StatusBumperComponent,
    HideHeaderComponent,
    NgClass
  ]
})
export class ChapterViewComponent  implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private chapterPipe: ChapterPipeline,
    private historyMgmt: HistoryMgmt,
    private router: Router
  ) { }

  @ViewChild("Content") content!: IonContent;

  workId: string | null = null;
  chapterId: string | null = null;
  chapter: Chapter | null = null;

  history: History | null = null;

  // Scroll vars
  maxHeight: number = 0;
  savedScrollPos: number = 0;
  scrollDiff: number = 100;

  hideHeader: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.chapterId = params.get('chapterId');
      this.history = null;
      this.chapter = null;
      this.grabChapter();
    })
  }

  ngOnDestroy() {
    this.historyMgmt.updateHistoryList();
    logger.info(JSON.stringify(this.history));
  }

  grabChapter() {
    if (typeof this.content != "undefined") this.content.scrollToTop(0)
    if (this.workId != null && this.chapterId != null) {
      this.chapterPipe.get(Number(this.workId), Number(this.chapterId), 1).subscribe(chapter => {
        this.chapter = chapter

        this.historyMgmt.get(Number(this.workId), Number(this.chapterId)).subscribe(history => {
          this.history = history;
          // logger.info("pos: "+this.history.scrollPosition+" max: "+this.history.scrollMax);
          history.chapterHeader = JSON.parse(JSON.stringify(this.chapter!.chapterHeader));
          history.author = JSON.parse(JSON.stringify(this.chapter!.author));
          history.workTitle = JSON.parse(JSON.stringify(this.chapter!.workTitle));
        })
      });
    }
  }

  handleRefresh(event: RefresherCustomEvent) {
    if (this.workId != null && this.chapterId != null) this.chapterPipe.get(Number(this.workId), Number(this.chapterId), 2).subscribe(chapter => {
      this.chapter = chapter;
      this.maxHeight = ((document.getElementById("InnerContent")!.offsetHeight) - (document.getElementById("OuterContent")!.offsetHeight));
      if (this.history != null) {
        this.history.scrollMax = this.maxHeight;
        this.historyMgmt.update(this.history!);
      }
      event.target.complete();
    });
  }

  openWebPage() {
    Browser.open({ url: "https://archiveofourown.org/works/"+this.workId });
  }

  bodyLoad() {
    if (this.chapter != null && this.history != null && this.history.scrollPosition >= 100) { // Resume reading position
      this.content.scrollToPoint(0, this.history.scrollPosition, 100);
    }
    this.maxHeight = ((document.getElementById("InnerContent")!.offsetHeight) - (document.getElementById("OuterContent")!.offsetHeight));
    if (this.history != null) {
      this.history.scrollMax = this.maxHeight;
      this.historyMgmt.update(this.history!);
    }
  }

  hideChange(e: boolean) {
    if (e) StatusBar.hide();
    else StatusBar.show();
    this.hideHeader = e;
  }

  scrollHandler(event: any) {
    if (Math.abs(event.detail.scrollTop - this.savedScrollPos) >= this.scrollDiff) {
      this.savedScrollPos = JSON.parse(JSON.stringify(event.detail.scrollTop));
      if (this.history != null) this.history.scrollPosition = this.savedScrollPos;
      this.historyMgmt.update(this.history!);
    }

    if (event.detail.scrollTop >= this.maxHeight) { // Reached bottom
      this.savedScrollPos = JSON.parse(JSON.stringify(this.maxHeight))+100;
      if (this.history != null) this.history.scrollPosition = this.savedScrollPos;
      this.historyMgmt.update(this.history!);
    }
  }

  nextChapter() {
    this.savedScrollPos = JSON.parse(JSON.stringify(this.maxHeight))+100; // Added to max to prevent decimals from causing issues
    if (this.history != null) this.history.scrollPosition = this.savedScrollPos;
    this.historyMgmt.update(this.history!);
    this.historyMgmt.resetPos(this.chapter!.workId, this.chapter!.nextId)
    this.router.navigate(['/work/' + this.workId + '/chapter/' + this.chapter!.nextId], {skipLocationChange: true});
  }
}
