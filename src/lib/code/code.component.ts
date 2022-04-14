import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({ selector: '[code]' })
export class CodeDirective implements OnInit {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        let val = this.el.nativeElement.value;
        this.el.nativeElement.value = val.trim();
        this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
        this.renderer.setStyle(this.el.nativeElement, 'resize', 'none');
        this.renderer.setStyle(this.el.nativeElement, 'width', '400px');
        this.renderer.setStyle(this.el.nativeElement, 'height', '100px');
    }
}
