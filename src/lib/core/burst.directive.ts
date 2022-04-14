import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({ selector: '[burst]' })
export class BurstDirective implements OnInit {
    el: any = null;
    elButton: any = null;
    timeoutReset: any = null;

    constructor(el: ElementRef, private renderer: Renderer2) {
        this.el = el.nativeElement;
        this.elButton = this.el.offsetParent || this.el.parentElement.parentElement;
    }

    ngOnInit() {
        this.renderer.listen(this.elButton, 'mousedown', this.mousedown.bind(this));
    }

    mousedown(event: MouseEvent) {
        if (this.timeoutReset) {
            clearTimeout(this.timeoutReset);
        }
        const DURATION = 500;

        const buttonRectangle = this.elButton.getBoundingClientRect();
        const x = event.clientX - buttonRectangle.left;
        const y = event.clientY - buttonRectangle.top;
        const left = x - this.el.offsetWidth / 2;
        const top = y - this.el.offsetHeight / 2;
        this.el.style.left = `${left}px`;
        this.el.style.top = `${top}px`;

        let classNames = this.el.className.split(' ');
        if (classNames.indexOf('animating') < 0) {
            classNames.push('animating');
        }
        if (classNames.indexOf('animate') < 0) {
            classNames.push('animate');
        }
        this.el.className = classNames.join(' ');

        this.timeoutReset = setTimeout(() => {
            classNames = this.el.className.split(' ');
            let index: number;
            index = classNames.indexOf('animating');
            if (index > -1) {
                classNames.splice(index, 1);
            }
            index = classNames.indexOf('animate');
            if (index > -1) {
                classNames.splice(index, 1);
            }
            this.el.className = classNames.join(' ');
        }, DURATION);
    }
}
