import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';

@Injectable()
export class PLGQLClientsService {
    constructor(private plGraphQL: PLGraphQLService) {}

    getById(id: string, options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                id: id,
            };
            this.plGraphQL
                .query(
                    `query Client($id: ID!) {
                client(id: $id) {
                    id
                    firstName
                    lastName
                    externalId
                    birthday
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
                    englishLanguageLearnerStatus
                    locations {
                        edges {
                            node {
                                id
                                name
                                parent {
                                    id
                                    name
                                }
                            }
                        }
                    }
                    recordingAllowed
                    activeIep {
                        id
                        status
                        startDate
                        nextAnnualIepDate
                        nextEvaluationDate
                        prevEvaluationDate
                    }
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
