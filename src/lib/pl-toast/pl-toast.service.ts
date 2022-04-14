import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PLToastService {
    observer: any = null;
    observable: any = null;
    hideTimeoutTrigger: any = -1;
    hideDelayTime: number = 4000;
    autoHide: boolean = false;

    constructor() {}

    loadObserver(hideDelayTime?: number, autoHide?: boolean) {
        if (hideDelayTime !== undefined && hideDelayTime >= 0) {
            this.hideDelayTime = hideDelayTime;
        }
        if (autoHide !== undefined) {
            this.autoHide = autoHide;
        }
        if (this.observable) {
            return this.observable;
        }
        this.observable = new Observable((observer: any) => {
            this.observer = observer;
        });
        return this.observable;
    }

    resetTimeout() {
        if (this.hideTimeoutTrigger) {
            clearTimeout(this.hideTimeoutTrigger);
        }
    }

    delayHide(hideDelayTime1: number) {
        const hideDelayTime = hideDelayTime1 >= 0 ? hideDelayTime1 : this.hideDelayTime;
        this.resetTimeout();
        this.hideTimeoutTrigger = setTimeout(() => {
            this.hide();
        }, hideDelayTime);
    }

    /**
     * @param type1 Can be either 'error', 'warning', 'info', or 'success'
     * @param message The message to display in the modal
     * @param hideDelayTime The milliseconds you want the toaster to last. Optional.
     * @param autoHide boolean. Optional.
     */
    show(type1: string, message: string, hideDelayTime?: number, autoHide?: boolean) {
        this.resetTimeout();
        const validTypes = ['error', 'warning', 'info', 'success'];
        const type = validTypes.indexOf(type1) > -1 ? type1 : 'info';
        this.observer.next({ action: 'show', type: type, message: message });
        if (autoHide || this.autoHide) {
            this.delayHide(hideDelayTime);
        }
    }

    hide() {
        this.observer.next({ action: 'hide' });
    }
}
