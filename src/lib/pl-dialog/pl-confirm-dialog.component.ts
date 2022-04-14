import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef } from '@angular/core';
import { KeyboardEventKey } from '../common/enums';
import { PLConfirmDialogService, ConfirmDialogData } from './pl-confirm-dialog.service';

@Component({
    selector: 'pl-confirm-dialog',
    templateUrl: './pl-confirm-dialog.component.html',
    styleUrls: ['./pl-dialog.component.less'],
    encapsulation: ViewEncapsulation.None,
})
export class PLConfirmDialogComponent implements OnInit {
    @ViewChild('plConfirmDialogContentWrapper', { static: false }) plConfirmDialogContentWrapper: ElementRef;

    readonly DEFAULT_DATA: ConfirmDialogData = {
        type: 'default',
        toastType: 'warning',
        header: '',
        content: '',
        classesDialog: {
        },
        primaryLabel: 'OK',
        secondaryLabel: null,
        primaryClasses: {
            primary: true,
        },
        secondaryClasses: {},
        primaryCallback: null,
        secondaryCallback: null,
        closeCallback: null,
    };

    data: any = {};

    showDialog = false;

    leftIconSvg: any = '';
    leftIconSvgMap: any = {
        info: 'info',
        error: 'cross',
        warning: 'info',
        success: 'check',
    };

    constructor(private dialogService: PLConfirmDialogService) {
        this.resetData();
    }

    ngOnInit() {
        this.dialogService.observer$.subscribe((res: { action: string; data: ConfirmDialogData }) => {
            if (res.action === 'show') {
                this.show(res.data);
            } else {
                this.hide();
            }
        });
    }

    setClasses() {
        // Reset.
        const classes = {
            info: false,
            error: false,
            warning: false,
            success: false,
        };
        classes[this.data.type] = true;
        classes[this.data.toastType] = true;
        this.data.classesDialog = classes;
    }

    setLeftIcon(type: string) {
        this.leftIconSvg = this.data.leftIconSvg || this.leftIconSvgMap[type];
    }

    show(data: ConfirmDialogData) {
        this.showDialog = true;
        Object.assign(this.data, data);
        this.setClasses();
        this.setLeftIcon(this.data.toastType);
        setTimeout(() => this.plConfirmDialogContentWrapper.nativeElement.focus(), 0);
    }

    clickPrimary() {
        if (this.data.primaryCallback) {
            this.data.primaryCallback();
        }
        this.hide();
    }

    clickSecondary() {
        if (this.data.secondaryCallback) {
            this.data.secondaryCallback();
        }
        this.hide();
    }

    clickClose() {
        if (this.data.closeCallback) {
            this.data.closeCallback();
        }
        this.hide();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardEventKey.ESC) this.clickClose();
    }

    resetData() {
        Object.assign(this.data, this.DEFAULT_DATA);
    }

    hide() {
        this.showDialog = false;
        this.resetData();
    }
}