import { Injectable } from '@angular/core';

@Injectable()
export class PLWindowService {

    location = window.location;
    getSelection = window.getSelection;
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    outerHeight = window.outerHeight;
    outerWidth = window.outerWidth;
    pageXOffset = window.pageXOffset;
    pageYOffset = window.pageYOffset;
    addEventListener = window.addEventListener;
    // opr = window.opr;
    // opera = window.opera;

    constructor() {}
}
