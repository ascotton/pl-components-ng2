import { Component, ElementRef, ViewChild, HostBinding, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PLInputDropdownService } from './pl-input-dropdown.service';

@Component({
    selector: 'pl-input-dropdown',
    templateUrl: './pl-input-dropdown.component.html',
    styleUrls: ['./pl-input-shared.component.less', './pl-input-dropdown.component.less'],
    inputs: ['hidden', 'maxHeight', 'minWidth', 'containerSelector', 'margin', 'margins', 'refreshPosition'],
    host: {
        '(document:click)': 'onClick($event)',
        // 'class': { 'hidden': 'hidden' },
        '[style]': 'stylesHostString',
    },
})
export class PLInputDropdownComponent {
    @Output() onBlur = new EventEmitter<any>();

    @HostBinding('class.hidden') hidden: boolean = false;
    @ViewChild('dropdown', {static: false}) dropdown: ElementRef;

    // hidden: boolean = false;
    containerSelector: string = 'body';
    margin: number = 10;
    margins: any = {};
    maxHeight: number = 300;
    minWidth: any = 0;

    private stylesHost: any = {};
    private stylesHostString: any;

    constructor(
        private elementRef: ElementRef,
        private plInputDropdown: PLInputDropdownService,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.init();
        if (!this.hidden) {
            this.setPosition();
        }
    }

    ngOnChanges(changes: any) {
        this.init();
        if (changes.hidden && !this.hidden) {
            this.setPosition();
        }
    }

    init() {
        this.setStyles();
        this.setMargins();
    }

    setStyles() {
        this.stylesHost['max-height'] = `${this.maxHeight}px`;
        if (this.minWidth) {
            this.stylesHost['min-width'] = `${this.minWidth}px`;
        }
        this.updateStyles({});
    }

    setMargins() {
        const keys = ['top', 'bottom', 'left', 'right'];
        keys.forEach((key: any) => {
            if (this.margins[key] === undefined) {
                this.margins[key] = this.margin;
            }
        });
    }

    updateStyles(styles1: any) {
        const styles = Object.assign({}, this.stylesHost, styles1);
        let stylesString = ``;
        for (let ss in styles) {
            stylesString += `${ss}: ${styles[ss]}; `;
        }
        this.stylesHostString = this.sanitizer.bypassSecurityTrustStyle(stylesString);
    }

    setPosition() {
        // Need timeout to allow dropdown to be visible.
        setTimeout(() => {
            let styles = this.plInputDropdown.getPosition(
                this.dropdown.nativeElement.parentNode,
                this.containerSelector,
                this.margins
            );
            this.updateStyles(styles);
        }, 0);
    }

    onClick(evt: any) {
        // Sometimes (e.g. mini calendar) we get a null parent node so the `contains` check gives a false negative.
        // So we check the position as well in case the click actualy IS in the dropdown.
        if (
            !this.hidden &&
            !this.elementRef.nativeElement.contains(evt.target) &&
            !this.plInputDropdown.clickInRect(evt, this.elementRef.nativeElement)
        ) {
            if (this.onBlur) {
                this.onBlur.emit({ blurred: true, evt: evt });
            }
        }
    }
}
