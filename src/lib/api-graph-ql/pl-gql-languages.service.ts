import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';

@Injectable()
export class PLGQLLanguagesService {
    private languages: any[] = [];

    constructor(private plGraphQL: PLGraphQLService) {}

    get(options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                first: 100,
            };
            this.plGraphQL
                .query(
                    `query Languages($first: Int) {
                languages(first: $first) {
                    edges {
                        node {
                            id
                            name
                            code
                        }
                    }
                }
             }`,
                    variables,
                    {}
                )
                .subscribe(
                    (res: any) => {
                        this.languages = res.languages;
                        observer.next(res);
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
        });
    }

    formOpts(languages1: any = null) {
        const languages = languages1 || this.languages;
        if (languages && languages.length) {
            return languages.map((item: any) => {
                return { value: item.code, label: item.name };
            });
        }
        return [];
    }
}
