import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';
import { PLLodashService } from '../pl-lodash';

@Injectable()
export class PLGQLProviderTypesService {
    private providerTypes: any[] = [];

    constructor(private plGraphQL: PLGraphQLService, private plLodash: PLLodashService) {}

    get(options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                first: 100,
            };
            this.plGraphQL
                .query(
                    `query ProviderTypes($first: Int) {
                providerTypes(first: $first) {
                    edges {
                        node {
                            id
                            code
                            longName
                            shortName
                            isActive
                        }
                    }
                }
             }`,
                    variables,
                    {}
                )
                .subscribe(
                    (res: any) => {
                        this.providerTypes = res.providerTypes;
                        observer.next(res);
                    },
                    (err: any) => {
                        console.log('err', err);
                        observer.error(err);
                    }
                );
        });
    }

    formOpts(providerTypes1: any = null, options1?: { labelKey?: string; valueKey?: string }) {
        const options: any = Object.assign(
            {
                labelKey: 'shortName',
                valueKey: 'code',
            },
            options1
        );
        const providerTypes = providerTypes1 || this.providerTypes;
        if (providerTypes && providerTypes.length) {
            return providerTypes.map((item: any) => {
                return { value: item[options.valueKey], label: item[options.labelKey] };
            });
        }
        return [];
    }

    getValueFromKey(key: string, keyValue: any, valueKey: string, providerTypes1: any[] = null) {
        const providerTypes = providerTypes1 || this.providerTypes;
        return this.plLodash.getItemValueFromKey(providerTypes, key, keyValue, valueKey);
    }
}
