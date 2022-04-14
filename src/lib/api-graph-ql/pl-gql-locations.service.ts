import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';

@Injectable()
export class PLGQLLocationsService {
    private locations: any[] = [];

    constructor(private plGraphQL: PLGraphQLService) {}

    get(options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                first: 100,
            };
            this.plGraphQL
                .query(
                    `query Locations($first: Int) {
                locations(first: $first) {
                    edges {
                        node {
                            id
                            name
                            isActive
                            parent {
                                id
                                name
                            }
                        }
                    }
                }
             }`,
                    variables,
                    {}
                )
                .subscribe(
                    (res: any) => {
                        this.locations = res.locations;
                        observer.next(res);
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
        });
    }

    formOpts(locations1: any = null) {
        const locations = locations1 || this.locations;
        if (locations && locations.length) {
            return locations.map((item: any) => {
                return { value: item.id, label: item.name };
            });
        }
        return [];
    }
}
