import { Apollo} from 'apollo-angular';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { createHttpLink } from '@apollo/client/link/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PLHttpModule } from '../pl-http';
import { PLLodashService } from '../pl-lodash';

import { PLGraphQLService } from './pl-graph-ql.service';
import { PLGraphQLErrorService } from './pl-graph-ql-error.service';


// apollo-client >=2.0 version
// https://github.com/apollographql/apollo-client/blob/master/Upgrade.md
// https://github.com/apollographql/apollo-angular/pull/377


// import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';


import { getToken } from '../pl-http';
import { environment } from '../../environments/environment';

@NgModule({
    imports: [CommonModule, PLHttpModule],
    exports: [],
    // declarations: [],
    providers: [PLGraphQLService, PLGraphQLErrorService, PLLodashService],
})
export class PLGraphQLModule {
    constructor(apollo: Apollo) {
        const linkBase = createHttpLink({
            // TODO - add method to set url / setup network interface (or just take url paramter in this function)
            // uri: `${plUrls.urls.graphql}`,
            uri: environment.apps.apollo.url,
            fetch: fetch,
        });
        const middlewareLink = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                    authorization: `JWT ${getToken()}`,
                },
            });
            return forward(operation);
        });

        const link = middlewareLink.concat(linkBase);

        // To use unions, need to define them here.
        // https://github.com/apollographql/apollo-client/blob/94d8d200d727337f265a10472723b0af0fd59d7e/test/client.ts#L1113
        /*
        const ifm = new IntrospectionFragmentMatcher({
            introspectionQueryResultData: {
                __schema: {
                    types: [
                        {
                            kind: 'UNION',
                            name: 'ClientServiceUnion',
                            possibleTypes: [
                                {
                                    name: 'DirectService',
                                },
                                {
                                    name: 'Evaluation',
                                },
                                {
                                    name: 'ClientService',
                                },
                            ],
                        },
                    ],
                },
            },
        });
        */

        const cache = new InMemoryCache({
            possibleTypes: { 
                DirectService: [],
                Evaluation: [],
                ClientService: [],
            },
        });

        apollo.create({ link, cache });
    }
    static forRoot(): ModuleWithProviders<PLGraphQLModule> {
        return {
            ngModule: PLGraphQLModule,
            providers: [PLGraphQLService, PLGraphQLErrorService],
        };
    }
}

export { PLGraphQLService } from './pl-graph-ql.service';
export { PLGraphQLErrorService } from './pl-graph-ql-error.service';
