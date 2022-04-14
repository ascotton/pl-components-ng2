import { Injectable } from '@angular/core';

@Injectable()
export class PLNameService {
    constructor() {}

    parseFullName(name: string) {
        // Assume everything after first space is last name, including
        // suffixes like 'Jr.'.
        let firstName = name;
        let lastName = '';
        const indexSpace = name.indexOf(' ');
        if (indexSpace > -1) {
            firstName = name.slice(0, indexSpace);
            lastName = name.slice(indexSpace + 1, name.length);
        }
        return { firstName, lastName };
    }

    formFullName(firstName: string = '', lastName: string = '') {
        return `${firstName} ${lastName}`.trim();
    }
}
