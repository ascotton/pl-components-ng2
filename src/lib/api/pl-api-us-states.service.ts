import { Injectable } from '@angular/core';

import { PLLodashService } from '../pl-lodash';

@Injectable()
export class PLApiUsStatesService {
    private usStates: Record<string, string>[] = [
        { key: 'AK', name: 'Alaska' },
        { key: 'AL', name: 'Alabama' },
        { key: 'AR', name: 'Arkansas' },
        { key: 'AZ', name: 'Arizona' },
        { key: 'CA', name: 'California' },
        { key: 'CO', name: 'Colorado' },
        { key: 'CT', name: 'Connecticut' },
        { key: 'DC', name: 'District of Columbia' },
        { key: 'DE', name: 'Delaware' },
        { key: 'FL', name: 'Florida' },
        { key: 'GA', name: 'Georgia' },
        { key: 'HI', name: 'Hawaii' },
        { key: 'IA', name: 'Iowa' },
        { key: 'ID', name: 'Idaho' },
        { key: 'IL', name: 'Illinois' },
        { key: 'IN', name: 'Indiana' },
        { key: 'KS', name: 'Kansas' },
        { key: 'KY', name: 'Kentucky' },
        { key: 'LA', name: 'Louisiana' },
        { key: 'MA', name: 'Massachusetts' },
        { key: 'MD', name: 'Maryland' },
        { key: 'ME', name: 'Maine' },
        { key: 'MI', name: 'Michigan' },
        { key: 'MN', name: 'Minnesota' },
        { key: 'MO', name: 'Missouri' },
        { key: 'MS', name: 'Mississippi' },
        { key: 'MT', name: 'Montana' },
        { key: 'NC', name: 'North Carolina' },
        { key: 'ND', name: 'North Dakota' },
        { key: 'NE', name: 'Nebraska' },
        { key: 'NH', name: 'New Hampshire' },
        { key: 'NJ', name: 'New Jersey' },
        { key: 'NM', name: 'New Mexico' },
        { key: 'NV', name: 'Nevada' },
        { key: 'NY', name: 'New York' },
        { key: 'OH', name: 'Ohio' },
        { key: 'OK', name: 'Oklahoma' },
        { key: 'OR', name: 'Oregon' },
        { key: 'PA', name: 'Pennsylvania' },
        { key: 'RI', name: 'Rhode Island' },
        { key: 'SC', name: 'South Carolina' },
        { key: 'SD', name: 'South Dakota' },
        { key: 'TN', name: 'Tennessee' },
        { key: 'TX', name: 'Texas' },
        { key: 'UT', name: 'Utah' },
        { key: 'VA', name: 'Virginia' },
        { key: 'VT', name: 'Vermont' },
        { key: 'WA', name: 'Washington' },
        { key: 'WI', name: 'Wisconsin' },
        { key: 'WV', name: 'West Virginia' },
        { key: 'WY', name: 'Wyoming' },
    ];

    constructor(private plLodash: PLLodashService) {}

    getOpts() {
        return this.formOpts();
    }

    getOptsGQL() {
        return this.usStates
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((state) => {
                return { value: state.name, label: state.name };
            });
    }

    formOpts() {
        return this.usStates.map(state => {
            return { value: state.key, label: state.name };
        });
    }

    formOptsNameValue() {
        return this.usStates.map(state => {
            return { value: state.name.toLowerCase(), label: state.name };
        });
    }

    getFromKey(key: string, keyValue: any, usStates1: any[] = null) {
        const usStates = usStates1 || this.usStates;
        const index = this.plLodash.findIndex(usStates, key, keyValue);
        return index > -1 ? usStates[index] : null;
    }

    getFromPostalCode(code: string) {
        const state = this.getFromKey('key', code);

        return state ? state.name : '';
    }
}
