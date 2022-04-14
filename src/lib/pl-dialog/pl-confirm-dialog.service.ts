import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface ConfirmDialogData {
    type?: string;
    toastType?: string;
    header?: string;
    content: string;
    leftIconSvg?: string;
    classesDialog?: any;
    primaryLabel: string;
    secondaryLabel?: string;
    primaryClasses?: any;
    secondaryClasses?: any;
    primaryCallback: () => void;
    secondaryCallback?: () => void;
    closeCallback?: () => void;
}

@Injectable({ providedIn: 'root' })
export class PLConfirmDialogService {
    observer$: Subject<{ action: string, data?: ConfirmDialogData }> = new Subject();

    constructor() {}

    loadObserver() {
        return this.observer$.asObservable();
    }

    show(data: ConfirmDialogData) {
        this.observer$.next({ data, action: 'show' });
    }

    hide() {
        this.observer$.next({ action: 'hide' });
    }
}
