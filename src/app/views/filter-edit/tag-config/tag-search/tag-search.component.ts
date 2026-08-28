import {Component, Input, OnInit} from '@angular/core';
import {
  IonAvatar,
  IonButton, IonChip,
  IonContent, IonIcon,
  IonImg,
  IonItem, IonLabel,
  IonList,
  IonModal,
  IonSearchbar
} from '@ionic/angular/standalone';
import {AO3} from '../../../../data/handlers/ao3';
import {logger} from '../../../../data/handlers/logger';

@Component({
  selector: 'filter-edit-tag-search',
  templateUrl: './tag-search.component.html',
  styleUrls: ['./tag-search.component.less'],
  imports: [
    IonButton,
    IonModal,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonImg,
    IonLabel,
    IonChip,
    IonIcon
  ]
})
export class TagSearchComponent implements OnInit {
  constructor(private ao3: AO3) {}

  @Input() id: string = "";
  @Input() section: string = "";
  @Input() label: string = "";
  @Input() tags: string[] = [];

  searchTags: string[] = [];

  ngOnInit() {}

  removeTag(tag: string) {
    this.tags.splice(this.tags.indexOf(tag), 1);
  }

  searchTagIcon(tag: string): string {
    return this.tags.includes(tag)?"checkmark-outline":"add-outline";
  }

  toggleTag(tag: string): void {
    if (this.tags.indexOf(tag) > -1) this.tags.splice(this.tags.indexOf(tag), 1);
    else this.tags.push(tag);
  }

  search(e: any): void {
    this.ao3.getAutocomplete(this.section, e.target.value).subscribe(data => {
      logger.info(JSON.stringify(data.data));
      if (data.data != null && data.data.length > 0) {
        this.searchTags = []
        for (let i = 0; i < data.data.length; i++) {
          this.searchTags.push(data.data[i].name);
        }
      }
    })
  }
}
