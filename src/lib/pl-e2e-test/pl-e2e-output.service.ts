import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class PLE2EOutputService {
    observer: any = null;
    observable: any = null;

    constructor() {}

    loadObserver() {
        if (this.observable) {
            return this.observable;
        }
        this.observable = new Observable((observer: any) => {
            this.observer = observer;
        });
        return this.observable;
    }

    setOutput(output: string) {
        this.observer.next({ output: output });
    }
}
