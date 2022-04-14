import { NgModule } from '@angular/core';
import { CommifyPipe } from './commify.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';

@NgModule({
    declarations: [CommifyPipe, SafeHtmlPipe, SafePipe],
    imports: [CommonModule],
    exports: [CommifyPipe, SafeHtmlPipe, SafePipe],
})
export class PipeModule {}
