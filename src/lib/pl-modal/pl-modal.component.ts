import { DOCUMENT } from '@angular/common';
import { PLModalServiceRoot } from './pl-modal.service';
import { Component, ViewChild, ViewContainerRef, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { KeyboardEventKey } from '../common/enums';

@Component({
    selector: 'pl-modal',
    templateUrl: './pl-modal.component.html',
    styleUrls: ['./pl-modal.component.less'],
})
export class PLModalComponent implements AfterViewInit {
    @ViewChild('plModalContentWrapper') plModalContentWrapper: ElementRef;
    @ViewChild('plModalContent') plModalContent: ElementRef;
    @ViewChild('plModalPlaceholder', { read: ViewContainerRef }) plModalPlaceholder: any;

    classesCont: any = {
        visible: false,
    };

    constructor(
        private modalService: PLModalServiceRoot,
        @Inject(DOCUMENT) private document: Document,
    ) { }

    ngAfterViewInit() {
        this.modalService.loadObserver().subscribe((res: { action: string; inputs: any }) => {
            if (res.action === 'show') {
                if (res.inputs) {
                    this.setInputs(res.inputs);
                }
                this.show();
            } else {
                this.hide();
            }
        });

        this.modalService.registerViewContainerRef(this.plModalPlaceholder);
    }

    setInputs(inputs: any) { }

    show() {
        this.classesCont.visible = true;
        setTimeout(() => {
            this.focusChildModal();
            this.document.body.style.overflowY = 'hidden';
        }, 200);
    }

    hide() {
        this.document.body.style.overflowY = '';
        this.classesCont.visible = false;
    }

    clickBackground(evt: any) {
        if (this.modalService.isBackgroundClickDisabled()) {
            event.stopPropagation();
            this.focusChildModal();
            return;
        }
        if (!this.plModalContent.nativeElement.contains(evt.target)
            && this.plModalContentWrapper.nativeElement.contains(evt.target)) {
            this.hide();
            this.modalService.hide();
        }
    }

    // a raw click event on the modal surface should not propagate up to the parent elements
    // to ensure that page scroll suppression is not deactivated prematurely.
    handleClick(event: Event) {
        event.stopPropagation();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardEventKey.ESC) {
            this.hide();
            this.modalService.hide();
        }
    }

    private focusChildModal(): void {
        const plModalHeaderWrapperBody: any = this.plModalContent.nativeElement.getElementsByClassName('modal-body');
        if (plModalHeaderWrapperBody.length === 1) plModalHeaderWrapperBody[0].focus();
    }
}
