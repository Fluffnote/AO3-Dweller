import {Component, Input, OnInit} from '@angular/core';
import {IonCheckbox, IonInput, IonRadio, IonRadioGroup, IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import {languageMap} from '../../../data/models/support/search-options.enum';
import {WorkFilter} from '../../../data/models/filters/work-filter';
import {FormsModule} from '@angular/forms';
import {logger} from '../../../data/handlers/logger';
import {PeopleFilter} from '../../../data/models/filters/people-filter';
import {BookmarkFilter} from '../../../data/models/filters/bookmark-filter';
import {TagFilter} from '../../../data/models/filters/tag-filter';
import {Filter} from '../../../data/models/filters/filter';

@Component({
  selector: 'filter-edit-work-info',
  templateUrl: './work-info.component.html',
  styleUrls: ['./work-info.component.less'],
  imports: [
    IonInput,
    IonSelect,
    IonSelectOption,
    IonRadioGroup,
    IonRadio,
    IonCheckbox,
    FormsModule
  ]
})
export class WorkInfoComponent implements OnInit {
  constructor() {}

  @Input() filter: WorkFilter = new WorkFilter();

  protected readonly languageMap = languageMap;

  ngOnInit() {}

  updateVar(e: any, varName: string) {
    if (varName == "query") this.filter.query = `${(e.target as HTMLIonInputElement).value}`
    if (varName == "title") this.filter.title = `${(e.target as HTMLIonInputElement).value}`
    if (varName == "creators") this.filter.creators = `${(e.target as HTMLIonInputElement).value}`
    if (varName == "revisedAt") this.filter.revisedAt = `${(e.target as HTMLIonInputElement).value}`
    if (varName == "complete") { // @ts-ignore
      this.filter.complete = `${(e.target as HTMLIonInputElement).value}`
    }
    if (varName == "crossover") { // @ts-ignore
      this.filter.crossover = `${(e.target as HTMLIonInputElement).value}`
    }
    if (varName == "language") { // @ts-ignore
      this.filter.languageId = `${(e.target as HTMLIonInputElement).value}`
    }
  }
}
