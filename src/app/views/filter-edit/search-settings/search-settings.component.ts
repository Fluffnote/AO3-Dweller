import {Component, Input, OnInit} from '@angular/core';
import {IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import {WorkFilter} from '../../../data/models/filters/work-filter';

@Component({
  selector: 'filter-edit-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.less'],
  imports: [
    IonSelect,
    IonSelectOption
  ]
})
export class SearchSettingsComponent implements OnInit {
  constructor() {}

  @Input() filter: WorkFilter = new WorkFilter();

  ngOnInit() {}
}
