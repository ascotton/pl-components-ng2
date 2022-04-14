import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type SafeContentType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {
    constructor(
        private sanitizer: DomSanitizer,
    ) {}

    transform(value: string, type: SafeContentType) {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Invalid safe type: ${type}`);
        }
    }
}