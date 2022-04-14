import { PLModalService } from './pl-modal.service';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'pl-modal-header-wrapper',
    templateUrl: './pl-modal-header-wrapper.component.html',
    styleUrls: ['./pl-modal-header-wrapper.component.less'],
})
export class PLModalHeaderWrapperComponent {
    @Input() headerText = '';
    @ViewChild('plModalHeaderWrapperBody', { static: false }) plModalHeaderWrapperBody: ElementRef;

    constructor(private modalService: PLModalService) { }

    hide() {
        // TODO - hide just this instance?
        this.modalService.destroyAll();
    }
}
