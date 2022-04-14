import {Apollo, gql} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';




import { PLGraphQLErrorService } from './pl-graph-ql-error.service';

import { PLLodashService } from '../pl-lodash';
import { PLToastService } from '../pl-toast';
import { PLUrlsService } from '../pl-http';

@Injectable()
export class PLGraphQLService {
    client: any = null;

    private requestMap = {};

    constructor(
        private apollo: Apollo,
        private plGraphQLError: PLGraphQLErrorService,
        private plLodash: PLLodashService,
        private plToast: PLToastService,
        private plUrls: PLUrlsService,
    ) {}

    reset() {
        this.apollo.getClient().resetStore();
    }

    clearCache() {
        // Reset store just refetches queries, it does not actually (only) reset.
        // Update: this does not seem to reset either, just refetches as well..
        // https://github.com/Akryum/vue-apollo/issues/53#issuecomment-374868508
        this.apollo.getClient().cache.reset();
    }

    /**
    Strip out nested `edges` and `node` and make object mutable.
    https://github.com/apollographql/apollo-angular/issues/272
    */
    toSimpleData(data: any) {
        return this.simplifyData(data.data);
    }

    simplifyData(item: any): any {
        let itemCopy;
        if (Array.isArray(item)) {
            itemCopy = item.slice();
            return itemCopy.map((item1: any) => {
                return this.simplifyData(item1);
            });
        } else if (item !== null && typeof item === 'object') {
            itemCopy = {};
            const skip = ['__typename'];
            for (let key in item) {
                if (skip.indexOf(key) < 0) {
                    itemCopy[key] = this.plLodash.copy(item[key]);
                }
            }
            itemCopy = this.stripEdgesAndNodes(itemCopy);
            for (let key in itemCopy) {
                if (skip.indexOf(key) < 0) {
                    itemCopy[key] = this.simplifyData(itemCopy[key]);
                } else {
                    delete itemCopy[key];
                }
            }
            return itemCopy;
        }
        return item;
    }

    stripEdgesAndNodes(item: any) {
        if (item === null || typeof item !== 'object') {
            return item;
        }
        const skip = ['__typename'];
        let hadEdgesOrNode: boolean = false;
        for (let xx in item) {
            if (skip.indexOf(xx) > -1) {
                delete item[xx];
            }
            if (item[xx] !== null && typeof item[xx] === 'object') {
                if (item[xx].edges) {
                    for (let yy in item[xx]) {
                        if (yy !== 'edges' && yy !== 'node' && skip.indexOf(yy) < 0) {
                            let prefixedKey = `${xx}_${yy}`;
                            item[prefixedKey] = item[xx][yy];
                        }
                    }
                    if (item[xx].edges) {
                        item[xx] = item[xx].edges;
                        delete item[xx].edges;
                        hadEdgesOrNode = true;
                    }
                }
                if (item.node) {
                    item = item.node;
                    hadEdgesOrNode = true;
                }
            }
        }
        // Since changed structure of item, need to check it again, otherwise
        // could miss a level of edges / node.
        if (hadEdgesOrNode) {
            item = this.stripEdgesAndNodes(item);
        }
        return item;
    }

    private handleError(err: any, options: any = { suppressError: false }) {
        console.log(`--- Application plGraphQL error ${(err && err.status) || ''}`, err);
        if (err.status === 502 && localStorage.getItem('PL_SUPPRESS_502')) {
            return;
        }

        if (options.suppressErrorFunction) {
            options.suppressError = options.suppressErrorFunction(err);
        }
        if (!options.suppressError) {
            const message = this.plGraphQLError.get(err);
            this.plToast.show('error', message);
        }
    }

    private findErrors(res: any, type: string) {
        if (type === 'query') {
            if (res.errors) {
                return { errors: res.errors, status: res.status };
            }
        } else if (type === 'mutate') {
            if (res.data) {
                for (const key in res.data) {
                    if (res.data[key].errors) {
                        return { errors: res.data[key].errors, status: res.data[key].status } ;
                    }
                }
            }
        }
        return null;
    }

    private getUri() {
        return this.plUrls.urls.apollo;
    }

    query(query: any, variables: any = {}, options1: any = {}, params1: any = {}): Observable<any> {
        return this.go('query', query, variables, options1, params1);
    }

    /**
     *
     * @param query
     * @param variables
     * @param options1
     * @param params1
     * @param handleErrorManually Whether to display the default err message or handle it manually by passing true here.
     * @returns
     */
    mutate(
        query: any, variables: any = {},
        options1: any = {}, params1: any = {},
        handleErrorManually: boolean = false,
    ): Observable<any> {
        return this.go('mutate', query, variables, options1, params1, handleErrorManually);
    }

    private addRequest(requestInfo) {
        this.requestMap[requestInfo.key] = 1;
        const count = Object.keys(this.requestMap).length;
    }

    private removeRequest(requestInfo) {
        const KEY = requestInfo.key;
        const TIMESTAMP = requestInfo.timestamp;
        const obj = this.requestMap[KEY];
        delete this.requestMap[KEY];
        const COUNT = Object.keys(this.requestMap).length;
        const NOW = Date.now();
        const DURATION = NOW - TIMESTAMP;
        localStorage.setItem('PL_LAST_GQL_COUNT', `${COUNT}`);
        localStorage.setItem('PL_LAST_GQL_TIME', `${NOW}`);
        const removed = !obj;
        const queryInfo = requestInfo.gqlQuery.definitions[0];
        const name = (queryInfo.name && queryInfo.name.value) || '';
        const query = `${queryInfo.operation} ${name}`;
        const info: any = { COUNT, DURATION, KEY, query };
        if (requestInfo.error) {
            info.error = requestInfo.error;
        }
        if (requestInfo.response) {
            info.response = requestInfo.response;
        }
        if (localStorage.getItem('PL_API_DEBUG')) {
            console.log(`GQL API - ${query} ${removed ? '💠 (removed)' : ''}`, info);
        }
    }

    private go(
        type: string, query: any,
        variables: any = {}, options1: any = {},
        params1: any = {}, handleErrorManually: boolean = false,
    ): Observable<any> {
        const options = {
            simplify: true,
            ...options1,
        };

        const gqlQuery = gql`${query}`;
        const params: any = {
            fetchPolicy: 'no-cache',
            context: {
                uri: this.getUri(),
            },
            ...params1,
        };
        // Apollo / graphql will not send the query if the variables is set
        // but it is a query with no arguments. So only add variables if not empty.
        if (variables && !this.plLodash.isObjectEmpty(variables)) {
            params.variables = variables;
        }

        let observable: Observable<any>;

        if (type === 'query') {
            params.query = gqlQuery;

            observable = this.apollo.watchQuery(params).valueChanges;
        } else if (type === 'mutate') {
            params.mutation = gqlQuery;
            // Mutation ONLY accepts this policy (will error otherwise).
            params.fetchPolicy = 'no-cache';

            observable = this.apollo.mutate(params);
        }

        if (options.debug) {
            console.log(`apollo.${type}`, query, JSON.stringify(variables));
        }

        const requestInfo: any = {
            key: `${Math.random()}`,
            timestamp: Date.now(),
            gqlQuery
        };
        this.addRequest(requestInfo);

        return observable
        .pipe(
            catchError((err: any) => {
                requestInfo.error = err;
                this.removeRequest(requestInfo);
                if (options.debug) {
                    console.log(`apollo.${type} err`, err, query, JSON.stringify(variables));
                }
                this.handleError(err, options);
                // Deprecated in rxjs 6; use throwError instead.
                throw err;
            }),
            tap((res: any) => {
                requestInfo.response = res;
                this.removeRequest(requestInfo);
                if (options.debug) {
                    console.log(`apollo.${type} res`, res, query, JSON.stringify(variables));
                }

                const errors = this.findErrors(res, type);

                if (errors) {
                    if (!handleErrorManually) {
                        this.handleError(errors, options);
                    }
                    throw res; // Deprecated in rxjs 6; use throwError instead.
                }

                if (options.clearCache) {
                    this.clearCache();
                }
            }),
            map((res: any) => options.simplify ? this.toSimpleData(res) : res),
        )
    }
}
