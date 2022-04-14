import { Injectable } from '@angular/core';

@Injectable()
export class TitleStub {
    title: string = '';

    setTitle(text: string) {
        this.title = text;
        return text;
    }

    getTitle() {
        return this.title;
    }
}