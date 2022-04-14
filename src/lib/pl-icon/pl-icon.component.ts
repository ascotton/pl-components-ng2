import { Component, Input, HostBinding } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SvgInlineNgPluginService } from '../../build/svg-inline-ng-plugin.service';

@Component({
    selector: 'pl-icon',
    templateUrl: './pl-icon.component.html',
    styleUrls: ['./pl-icon.component.less'],
    inputs: ['svg', 'inline', 'width', 'height', 'scale', 'verticalAlign'],
    providers: [SvgInlineNgPluginService],
})
export class PLIconComponent {
    svg: string = 'lock';
    inline: boolean = true;
    scale: number = 1;
    width: number = 20;
    height: number = 0;
    verticalAlign: any = '';
    svgCode: SafeHtml = '';
    classes: any = {};
    styles: any = {};

    @HostBinding('style.width') hostWidth: string;
    @HostBinding('style.height') hostHeight: string;
    @HostBinding('style.display') hostDisplay: string = 'inline-block';

    constructor(private sanitizer: DomSanitizer, private svgInlineNgPluginService: SvgInlineNgPluginService) {}

    ngOnInit() {
        // Default to square so make height same as width.
        this.height = this.height ? this.height : this.width;
        this.classes.container = {
            inline: this.inline,
        };
        const stylesContainer = {
            width: `${this.width * this.scale}px`,
            height: `${this.height * this.scale}px`,
        };
        this.hostWidth = `${this.width * this.scale}px`;
        this.hostHeight = `${this.height * this.scale}px`;
        if (this.inline) {
            if (!this.verticalAlign) {
                this.verticalAlign = 'middle';
                if (this.scale < 1) {
                    this.verticalAlign = '';
                }
                if (this.scale === 1 && this.height === 20) {
                    this.verticalAlign = '-4px';
                }
            }
            if (this.verticalAlign !== '') {
                stylesContainer['vertical-align'] = this.verticalAlign;
            }
        }
        this.styles.container = stylesContainer;
        this.setSvg();
    }

    ngOnChanges(changes: any) {
        if (changes.svg) {
            this.setSvg();
        }
    }

    setSvg() {
        if (this.svgInlineNgPluginService.svgs[this.svg] && this.svgInlineNgPluginService.svgs[this.svg].html) {
            this.svgCode = this.sanitizer.bypassSecurityTrustHtml(this.svgInlineNgPluginService.svgs[this.svg].html);
        }
    }
}
