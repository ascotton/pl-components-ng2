import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


@Injectable()
export class PLInputDropdownService {
    constructor() {}

    clickInRect(evt: any, element: any) {
        if (element && element.getBoundingClientRect) {
            const rect = element.getBoundingClientRect();
            const clickX = evt.clientX;
            const clickY = evt.clientY;
            if (rect.left <= clickX && clickX <= rect.right && rect.top <= clickY && clickY <= rect.bottom) {
                return true;
            }
        }
        return false;
    }

    getCoords(elem: any, elemSelector: string = '') {
        if (!elem) return {};
        
        let box = elem.getBoundingClientRect();

        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;

        let top = Math.round(box.top + scrollTop - clientTop);
        let left = Math.round(box.left + scrollLeft - clientLeft);

        let bottom = top + elem.offsetHeight;
        // If body is not full height of window, want to use window bottom instead.
        if (elemSelector === 'body' && window.outerHeight > bottom) {
            bottom = window.outerHeight;
        }

        return {
            top: top,
            bottom: bottom,
            left: left,
            right: left + elem.offsetWidth,
            height: elem.offsetHeight,
            width: elem.offsetWidth,
        };
    }

    getPosition(dropdownEle: any, containerSelector: string, margins: any) {
        let styles: any = {};
        const dropdownCoords = this.getCoords(dropdownEle);
        const containerEle = document.querySelector(containerSelector);
        if (containerEle) {
            const containerCoords = this.getCoords(containerEle, containerSelector);
            const dropdownParentCoords = this.getCoords(dropdownEle.offsetParent);
            const bottom = containerCoords.bottom - margins.bottom;
            const top = containerCoords.top + margins.top;
            // If too low, switch to a dropdown that shows above the parent.
            if (dropdownCoords.bottom > bottom && dropdownParentCoords.top - dropdownCoords.height > top) {
                // Adjust style to subtract the offset parent position.
                // styles.top = (bottom - dropdownCoords.height) - dropdownParentCoords.top;
                styles.top = dropdownParentCoords.top - dropdownCoords.height - dropdownParentCoords.top;
            }
        }
        for (let ss in styles) {
            styles[ss] = `${styles[ss]}px`;
        }
        return styles;
    }
}
