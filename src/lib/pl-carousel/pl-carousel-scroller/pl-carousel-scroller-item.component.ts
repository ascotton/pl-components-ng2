import { Component, Input, HostBinding } from '@angular/core';

import { PLCarouselScrollerService } from './pl-carousel-scroller.service';

@Component({
    selector: 'pl-carousel-scroller-item',
    templateUrl: './pl-carousel-scroller-item.component.html',
    styleUrls: ['./pl-carousel-scroller-item.component.less'],
})
export class PLCarouselScrollerItemComponent {
    @Input('item') item: any = {};

    constructor(private plCarouselScroller: PLCarouselScrollerService) {}

    selectItem() {
        this.plCarouselScroller.selectItem(this.item);
    }
}
