import {Component, Input, OnInit} from '@angular/core';
import {IonLabel, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView} from '@ionic/angular/standalone';
import {TagSearchComponent} from './tag-search/tag-search.component';
import {TagSet} from '../../../data/models/filters/filter';

@Component({
  selector: 'filter-edit-tag-config',
  templateUrl: './tag-config.component.html',
  styleUrls: ['./tag-config.component.less'],
  standalone: true,
  imports: [
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
    TagSearchComponent,
  ]
})
export class TagConfigComponent implements OnInit {
  constructor() {}

  @Input() tagType: string = "";
  @Input() label: string = "";
  @Input() tagset: TagSet = new TagSet();

  ngOnInit() {}
}
