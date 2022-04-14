import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';

@Injectable()
export class PLGQLProvidersService {
    constructor(private plGraphQL: PLGraphQLService) {}

    getById(id: string, options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                id: id,
            };
            this.plGraphQL
                .query(
                    `query ProviderProfile($id: ID!) {
                providerProfile(id: $id) {
                    id
                    user {
                        username
                        firstName
                        lastName
                    }
                    providerTypes {
                        edges {
                            node {
                                id
                                code
                                shortName
                                longName
                                isActive
                            }
                        }
                    }
                    primaryLanguage {
                        id
                        code
                        name
                    }
                    secondaryLanguage {
                        id
                        code
                        name
                    }
                    timezone
                    contactPreference
                    caseloadCount
                }
             }`,
                    variables,
                    {}
                )
                .subscribe(
                    (res: any) => {
                        observer.next(res);
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
        });
    }
}
