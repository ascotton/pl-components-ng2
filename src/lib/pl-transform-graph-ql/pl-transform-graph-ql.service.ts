import { Injectable } from '@angular/core';

import { PLLodashService } from '../pl-lodash';

@Injectable()
export class PLTransformGraphQLService {
    constructor(private plLodash: PLLodashService) {}

    fromSnakeCase(item: any): any {
        let itemCopy;
        let camelKey;
        let keyMap = {
            uuid: 'id',
        };
        let skipPrefixes = ['_'];
        if (Array.isArray(item)) {
            itemCopy = item.slice();
            return itemCopy.map(item1 => {
                return this.fromSnakeCase(item1);
            });
        } else if (item !== null && typeof item === 'object') {
            itemCopy = {};
            let skip = false;
            for (let key in item) {
                skipPrefixes.forEach(prefix => {
                    if (key.indexOf(prefix) === 0) {
                        skip = true;
                    }
                });
                if (!skip) {
                    camelKey = this.plLodash.camelCase(key);
                    if (keyMap[key]) {
                        itemCopy[keyMap[key]] = this.fromSnakeCase(item[key]);
                    } else {
                        itemCopy[camelKey] = this.fromSnakeCase(item[key]);
                    }
                }
            }
            return itemCopy;
        }
        return item;
    }
}
