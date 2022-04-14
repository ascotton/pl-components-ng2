import { Injectable } from '@angular/core';

import { omit, pick, camelCase, throttle } from 'lodash';

@Injectable()
export class PLLodashService {

    pick = pick;
    omit = omit;
    camelCase = camelCase;
    throttle = throttle;

    constructor() {}

    findIndex(array1: any, key: any, value: any) {
        for (let ii = 0; ii < array1.length; ii++) {
            if (this.dotNotationKeyValue(array1[ii], key) === value) {
                return ii;
            }
        }
        return -1;
    }

    dotNotationKeyValue(obj: any, keysString: any) {
        let val = obj;
        const keys = keysString.split('.');
        keys.forEach((key: any) => {
            val = val[key];
        });
        return val;
    }

    randomString(length: number = 10) {
        let text: string = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let ii = 0; ii < length; ii++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text;
    }

    noKeys(obj1: any) {
        return Object.keys(obj1).length === 0 ? true : false;
    }

    // Note: cannot use `omit` as the argument name otherwise the omit above gets improperly set.
    equals(obj1Raw: any, obj2Raw: any, omit1: any = null, matchValues: boolean = false) {
        if (typeof obj1Raw === 'string' || typeof obj2Raw === 'string') {
            return obj1Raw === obj2Raw;
        }
        let obj1: any;
        let obj2: any;
        if (omit1 && omit1.length) {
            obj1 = this.omit(obj1Raw, omit1);
            obj2 = this.omit(obj2Raw, omit1);
        } else {
            obj1 = obj1Raw;
            obj2 = obj2Raw;
        }
        if (this.noKeys(obj1) && this.noKeys(obj2)) {
            return true;
        }
        // return angular.equals(obj1, obj2);

        let key: any;
        for (key in obj1) {
            if (!obj2[key]) {
                return false;
            }
            if (matchValues && obj1[key] !== obj2[key]) {
                return false;
            }
        }
        // Check both ways.
        for (key in obj2) {
            if (!obj1[key]) {
                return false;
            }
            if (matchValues && obj2[key] !== obj1[key]) {
                return false;
            }
        }
        return true;
    }

    sort2d(array1: any, key: any, order: string = 'ascending') {
        let aVal: any;
        let bVal: any;
        return array1.sort((a: any, b: any) => {
            aVal = this.dotNotationKeyValue(a, key);
            bVal = this.dotNotationKeyValue(b, key);
            if (aVal === bVal) {
                return 0;
            }
            if ((aVal > bVal && order === 'ascending') || (aVal < bVal && order === 'descending')) {
                return 1;
            }
            return -1;
        });
    }

    allTrue(obj1: any) {
        let allTrue = true;
        if (Array.isArray(obj1)) {
            for (let ii = 0; ii < obj1.length; ii++) {
                if (!obj1[ii]) {
                    allTrue = false;
                    break;
                }
            }
        } else {
            for (let xx in obj1) {
                if (!obj1[xx]) {
                    allTrue = false;
                    return allTrue;
                }
            }
        }
        return allTrue;
    }

    copy(item: any) {
        if (Array.isArray(item)) {
            return item.slice();
        } else if (item !== null && typeof item === 'object') {
            return Object.assign({}, item);
        }
        return item;
    }

    getFileExtension(filename1: string) {
        const filename = filename1.toLowerCase();
        const posDot = filename.lastIndexOf('.');
        if (posDot > -1) {
            return filename.slice(posDot + 1, filename.length);
        }
        return '';
    }

    stripFileExtension(filename: string) {
        const index = filename.lastIndexOf('.');
        if (index >= 0) {
            return filename.slice(0, filename.lastIndexOf('.'));
        } else {
            return filename;
        }
    }

    stripSpecialCharacters(text: string): { text: string, charactersFound: boolean } {
        const regex = new RegExp(/[^a-zA-Zñ0-9 ]/g);

        if (regex.test(text)) return { text: text.replace(regex, ''), charactersFound: true };
        return { text, charactersFound: false };
    }

    objectValues(obj: any) {
        // Gives typescript error - still experimental.
        // return Object.values(obj);
        const objValues = [];
        for (let key in obj) {
            objValues.push(obj[key]);
        }
        return objValues;
    }

    isObjectEmpty(obj: any) {
        return Object.keys(obj).length === 0 ? true : false;
    }

    /**
     * Eg. [{ first: 'Sarah', last: 'Pie' }, { first: 'Kim', last: 'Bo' }]
     * If key === 'first' and keyValue === 'Sarah' then return { first: 'Sarah', last: 'Pie' }
     */
    getItemFromKey(array1: any[], key: string, keyValue: any) {
        const index = this.findIndex(array1, key, keyValue);
        return index > -1 ? array1[index] : null;
    }

    /**
     * Uses the getItemFromKey function to get an object and
     * returns a particular value instead of whole object
     */
    getItemValueFromKey(array1: any[], key: string, keyValue: any, valueKey: string) {
        const obj = this.getItemFromKey(array1, key, keyValue);
        return obj && obj[valueKey] ? obj[valueKey] : '';
    }

    prefixProperties(prefix: string, obj: any): any {
        return Object.keys(obj).reduce((prefixedObject: any, key: string) => {
            prefixedObject[`${prefix}${key}`] = obj[key];
            return prefixedObject;
        }, {});
    }

    /**
     * range - returns a range as an array.
     *
     * From https://github.com/30-seconds/30-seconds-of-code#initializearraywithrange
     *
     * (3) => [0, 1, 2, 3]
     * (3, 1) => [1, 2, 3]
     * (3, 0, 2) => [0, 2]
     *
     * @param  {number} end end of range (inclusive)
     * @param  {number} start start of range (inclusive)
     * @param  {number} step
     * @return {number[]} range as an array
     */
    range(end: number, start = 0, step = 1): number[] {
        return Array.from({ length: Math.ceil((end - start + 1) / step) }, (_, i) => i * step + start);
    }
}
