import {Component, Input, OnChanges} from '@angular/core';
import {IonCheckbox, IonRange} from '@ionic/angular/standalone';
import {logger} from '../../../data/handlers/logger';
import {WorkFilter} from '../../../data/models/filters/work-filter';

@Component({
  selector: 'filter-edit-work-stats',
  templateUrl: './work-stats.component.html',
  styleUrls: ['./work-stats.component.less'],
  imports: [
    IonRange,
    IonCheckbox
  ]
})
export class WorkStatsComponent implements OnChanges {

  constructor() {}

  @Input() filter: WorkFilter = new WorkFilter();

  statSteps: string[] = [
    "0",
    "100",
    "200",
    "500",
    "1K",
    "2K",
    "5K",
    "10K",
    "20K",
    "50K",
    "100K",
    "200K",
    "500K",
    "1M",
    "2M",
    "5M",
    "∞"
  ]

  words: RangeSupport = new RangeSupport();
  hits: RangeSupport = new RangeSupport();
  kudos: RangeSupport = new RangeSupport();
  comments: RangeSupport = new RangeSupport();
  bookmarks: RangeSupport = new RangeSupport();

  ngOnChanges() {
    this.words = this.parseSearchValue2RS(this.filter.wordCount);
    this.hits = this.parseSearchValue2RS(this.filter.hitsCount);
    this.kudos = this.parseSearchValue2RS(this.filter.kudosCount);
    this.comments = this.parseSearchValue2RS(this.filter.commentsCount);
    this.bookmarks = this.parseSearchValue2RS(this.filter.bookmarksCount);
  }

  parseSearchValue2RS(value: string): RangeSupport {
    let out: RangeSupport = new RangeSupport();
    if (value === "") return out;

    out.value = value;
    let splitRange = value.split("-")
    if (splitRange.length > 1) { // has an upper and lower value
      let first = this.replaceLast(this.replaceLast(splitRange[0], "000000", "M"), "000", "K");
      let last = this.replaceLast(this.replaceLast(splitRange[1], "000000", "M"), "000", "K");
      out.label = first + "-" + last;
      out.range.lower = this.statSteps.indexOf(first.substring(1))
      out.range.upper = this.statSteps.indexOf(last.substring(1))
    }
    else { // only one value set
      if (value.includes(">")) { // lower one has changed
        out.label = this.replaceLast(this.replaceLast(value, "000000", "M"), "000", "K");
        out.range.lower = this.statSteps.indexOf(out.label.substring(1))
      }
      else { // upper one has changed
        out.label = this.replaceLast(this.replaceLast(value, "000000", "M"), "000", "K");
        out.range.upper = this.statSteps.indexOf(out.label.substring(1))
      }
    }

    return out;
  }

  replaceLast(str: string, pattern: any, replacement: string): string {
    const last = str.lastIndexOf(pattern);
    return last !== -1
      ? `${str.slice(0, last)}${replacement}${str.slice(last + pattern.length)}`
      : str;
  };

  rangeChange(event: any, out: string) {
    if (out == "words") {
      this.words = this.valueFormatter(event.detail.value)
      this.filter.wordCount = this.words.value
    }
    if (out == "hits") {
      this.hits = this.valueFormatter(event.detail.value)
      this.filter.hitsCount = this.hits.value
    }
    if (out == "kudos") {
      this.kudos = this.valueFormatter(event.detail.value)
      this.filter.kudosCount = this.kudos.value
    }
    if (out == "comments") {
      this.comments = this.valueFormatter(event.detail.value)
      this.filter.commentsCount = this.comments.value
    }
    if (out == "bookmarks") {
      this.bookmarks = this.valueFormatter(event.detail.value)
      this.filter.bookmarksCount = this.bookmarks.value
    }
  }

  pinFormatter(value: number) {
    // Doing this twice because ion-range doesn't pull in instance vars
    let statSteps: string[] = [
      "0",
      "100",
      "200",
      "500",
      "1K",
      "2K",
      "5K",
      "10K",
      "20K",
      "50K",
      "100K",
      "200K",
      "500K",
      "1M",
      "2M",
      "5M",
      "∞"
    ]

    return `${statSteps[value]}`
  }

  valueFormatter(value: { lower: number, upper: number }): RangeSupport {
    let out : RangeSupport = new RangeSupport();
    let temp = ""
    if (value.lower != 0 && value.upper != 16) temp = `${this.statSteps[value.lower]}-${this.statSteps[value.upper]}`
    if (value.lower == 0 && value.upper != 16) temp = `<${this.statSteps[value.upper]}`
    if (value.lower != 0 && value.upper == 16) temp = `>${this.statSteps[value.lower]}`
    if (temp != "") {
      out.label = temp
      out.value = temp.replaceAll("K", "000").replaceAll("M", "000000")
    }
    out.range = value
    return out;
  }

  singleChapterChange() {
    this.filter.singleChapter = !this.filter.singleChapter;
  }
}

class RangeSupport {
  value: string = "";
  label: string = "Any";
  range: { lower: number, upper: number } = { lower: 0, upper: 16 };
}
