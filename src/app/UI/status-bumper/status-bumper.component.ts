import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

@Component({
  selector: 'ui-status-border',
  templateUrl: './status-bumper.component.html',
  styleUrls: ['./status-bumper.component.less'],
  imports: [
    NgClass,
    NgStyle
  ]
})
export class StatusBumperComponent implements OnInit {

  constructor() { }

  @Input() hide: boolean = false;
  @Input() changeColor: boolean = false;

  ngOnInit() {}

  getStyle() {
    if (this.changeColor) return {backgroundColor: this.hide ? "var(--ion-item-background)" : "var(--ion-color-primary)"}
    else return {backgroundColor: "var(--ion-color-primary)"};
  }

}
