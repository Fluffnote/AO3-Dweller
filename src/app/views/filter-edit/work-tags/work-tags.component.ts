import { Component, Input, OnInit } from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import {TagConfigComponent} from '../tag-config/tag-config.component';
import {WorkFilter} from '../../../data/models/filters/work-filter';
import {logger} from '../../../data/handlers/logger';

@Component({
  selector: 'filter-edit-work-tags',
  templateUrl: './work-tags.component.html',
  styleUrls: ['./work-tags.component.less'],
  standalone: true,
  imports: [
    IonSelect,
    IonSelectOption,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    TagConfigComponent,
    IonSelectOption,
    IonAccordion
  ]
})
export class WorkTagsComponent implements OnInit {
  constructor() {}

  @Input() filter: WorkFilter = new WorkFilter();

  warnings: string[] = [];
  categories: string[] = [];

  ngOnInit() {}

  updateVar(e: any, varName: string) {
    if (varName == "rating") this.filter.ratingIds = `${(e.target as HTMLIonInputElement).value}`
    if (varName == "warnings") this.warnings = JSON.parse(JSON.stringify(e.target.value))
    if (varName == "categories") this.categories = JSON.parse(JSON.stringify(e.target.value))

    logger.info(JSON.stringify(e.target.value));
  }


}
