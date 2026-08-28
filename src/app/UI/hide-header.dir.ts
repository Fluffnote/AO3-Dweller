import {Directive, EventEmitter, HostListener, Input, OnInit, Output, Renderer2} from '@angular/core';
import { DomController } from '@ionic/angular';
import {StatusBar} from '@capacitor/status-bar';

@Directive({
  selector: '[HideOverlay]'
})
export class HideOverlayDirective {

  @Output("hide") hide = new EventEmitter<boolean>();

  private lastY = 0;
  private lag = 60;
  private _hide = false;

  constructor() { }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {
    if (Math.abs($event.detail.scrollTop - this.lastY) >= this.lag) {
      if ($event.detail.scrollTop > this.lastY) {
        this._hide = true;
        this.hide.emit(true);
        // StatusBar.hide();
      } else {
        this._hide = false;
        this.hide.emit(false);
        // StatusBar.show();
      }

      this.lastY = $event.detail.scrollTop;
    }
  }

  // @HostListener('click', ['$event']) onClick(e: any) {
  //   this._hide = !this._hide;
  //   this.hide.emit(this._hide);
  // }

  // @HostListener('touchstart', ['$event']) onTouch(e: any) {
  //   this._hide = !this._hide;
  //   this.hide.emit(this._hide);
  // }

}
