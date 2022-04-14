import { Injectable } from '@angular/core';

@Injectable()
export class LocationStub {

    _path: string = '';

    path() {
        return this._path;
    }

    setPath(path: string) {
        this._path = path;
    }
}