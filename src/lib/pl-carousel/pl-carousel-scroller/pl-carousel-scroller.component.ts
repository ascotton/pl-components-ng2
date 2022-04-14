import { Component, Input, ElementRef, ViewChild } from '@angular/core';

import { PLCarouselScrollerService } from './pl-carousel-scroller.service';

@Component({
    selector: 'pl-carousel-scroller',
    templateUrl: './pl-carousel-scroller.component.html',
    styleUrls: ['./pl-carousel-scroller.component.less'],
})
export class PLCarouselScrollerComponent {
    @Input('items') items: any[] = [];
    @Input('checkShowArrows') checkShowArrows = 0;
    @Input('styleArrowColor') styleArrowColor = '';
    @Input('styleArrowContColor') styleArrowContColor = '';

    @ViewChild('carouselWrapper') carouselWrapperEle: ElementRef;

    pageScrollRatio: number = 0.75;
    showLeftArrow = false;
    showRightArrow = false;
    scrollTime = 500;
    onScrollTimeout: any = null;
    // To prevent scroll from backing up if triggered rapidly in succession.
    // Only the current (most recent) scroll id will be used.
    currentScrollId = '';

    styles: any = {
        arrow: {},
        arrowCont: {},
    };

    constructor(private plCarouselScroller: PLCarouselScrollerService) {
        plCarouselScroller.itemsUpdated$.subscribe((data: { items: any[] }) => {
            this.items = data.items;
        });
    }

    ngOnInit() {
        this.plCarouselScroller.setItems(this.items);
        this.setStyles();
    }

    ngOnChanges(changes: any) {
        if (changes.items) {
            this.plCarouselScroller.setItems(this.items);
        }
        if (changes.checkShowArrows) {
            this.onResize();
        }
        if (changes.styleArrowColor) {
            this.setStyles();
        }
    }

    setStyles() {
        if (this.styleArrowColor) {
            this.styles.arrow.backgroundColor = this.styleArrowColor;
        }
        if (this.styleArrowContColor) {
            this.styles.arrowCont.backgroundColor = this.styleArrowContColor;
        }
    }

    ngAfterViewInit() {
        // Fix for expression has changed error.
        setTimeout(() => {
            this.onResize();
            if (this.carouselWrapperEle) {
                const ele = this.carouselWrapperEle.nativeElement;
                ele.onscroll = () => {
                    if (this.onScrollTimeout) {
                        clearTimeout(this.onScrollTimeout);
                    }
                    this.onScrollTimeout = setTimeout(() => {
                        this.onResize();
                    }, 500);
                };
            }
        }, 0);
    }

    onResizeEle(evt: any) {
        this.onResize();
    }

    onResize() {
        if (this.carouselWrapperEle) {
            const ele = this.carouselWrapperEle.nativeElement;
            const haveScrollbar = (ele.offsetWidth < ele.scrollWidth) ? true : false;
            let showLeftArrow = false;
            let showRightArrow = false;
            if (haveScrollbar) {
                if (ele.scrollLeft > 0) {
                    showLeftArrow = true;
                }
                if ((ele.scrollLeft + ele.offsetWidth) < ele.scrollWidth) {
                    showRightArrow = true;
                }
            }
            this.showLeftArrow = showLeftArrow;
            this.showRightArrow = showRightArrow;
        }
    }

    scrollPrev() {
        const ele = this.carouselWrapperEle.nativeElement;
        if (ele.scrollLeft > 0) {
            let amountToScroll = ele.offsetWidth * this.pageScrollRatio;
            let newLeft = ele.scrollLeft - amountToScroll;
            if (newLeft < 0) {
                newLeft = 0;
            }
            this.currentScrollId = (Math.random() + 1).toString(36).substring(7);
            this.scrollTo(ele, newLeft, this.scrollTime, this.currentScrollId);
        }
        setTimeout(() => {
            this.onResize();
        }, (this.scrollTime + 100))
    }

    scrollNext() {
        const ele = this.carouselWrapperEle.nativeElement;
        const width = ele.offsetWidth;
        if ((ele.scrollLeft + width) < ele.scrollWidth) {
            let amountToScroll = ele.offsetWidth * this.pageScrollRatio;
            let newLeft = ele.scrollLeft + amountToScroll;
            if ((newLeft + width) > ele.scrollWidth) {
                newLeft = (ele.scrollWidth - width);
            }
            this.currentScrollId = (Math.random() + 1).toString(36).substring(7);
            this.scrollTo(ele, newLeft, this.scrollTime, this.currentScrollId);
        }
        setTimeout(() => {
            this.onResize();
        }, (this.scrollTime + 100))
    }

    scrollTo(element: any, to: number, duration: number, scrollId = '') {
        if (duration <= 0 || scrollId !== this.currentScrollId) {
            return;
        }
        var difference = to - element.scrollLeft;
        var perTick = difference / duration * 10;

        setTimeout(() => {
            element.scrollLeft = element.scrollLeft + perTick;
            if (element.scrollLeft === to) {
                return;
            }
            this.scrollTo(element, to, (duration - 10), scrollId);
        }, 10);
    }
}
