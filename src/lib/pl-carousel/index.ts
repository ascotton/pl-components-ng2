import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLIconModule } from '../pl-icon/index';

import { PLCarouselScrollerService } from
 './pl-carousel-scroller/pl-carousel-scroller.service';
import { PLCarouselScrollerComponent } from
 './pl-carousel-scroller/pl-carousel-scroller.component';
import { PLCarouselScrollerItemComponent } from
 './pl-carousel-scroller/pl-carousel-scroller-item.component';


@NgModule({
    imports: [CommonModule, PLIconModule],
    exports: [PLCarouselScrollerComponent, PLCarouselScrollerItemComponent],
    declarations: [PLCarouselScrollerComponent, PLCarouselScrollerItemComponent],
    providers: [PLCarouselScrollerService]
})
export class PLCarouselModule {
    static forRoot(): ModuleWithProviders<PLCarouselModule> {
        return {
            ngModule: PLCarouselModule,
            providers: [PLCarouselScrollerService],
        };
    }
}

export { PLCarouselScrollerService } from
 './pl-carousel-scroller/pl-carousel-scroller.service';
