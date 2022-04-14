import {Apollo, gql} from 'apollo-angular';
import { TestBed, async } from '@angular/core/testing';




import { PLGraphQLErrorService } from './pl-graph-ql-error.service';

import { PLLodashService } from '../pl-lodash';
import { PLToastService } from '../pl-toast';

import { PLGraphQLService } from './pl-graph-ql.service';

import { PLUrlsService } from '../pl-http/';
import { ApolloStub } from '../../testing/apollo-stub';
import { PLToastStub } from '../../testing/pl-toast-stub';

describe('PLGraphQLService', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLGraphQLService,
                PLUrlsService,
                { provide: Apollo, useClass: ApolloStub },
                { provide: PLGraphQLErrorService, useClass: PLGraphQLErrorService },
                { provide: PLLodashService, useClass: PLLodashService },
                { provide: PLToastService, useClass: PLToastStub },
            ]
        });
        this.plGraphQLService = TestBed.get(PLGraphQLService);
        this.apollo = TestBed.get(Apollo);
    });

    describe('reset', () => {
        it('should reset', () => {
            this.plGraphQLService.reset();
        });
    });

    describe('toSimpleData', () => {
        it('should simplify clients data', () => {
            const rawData = {
                data: {
                    type: 'clients',
                    clients: {
                        __typename: 'ClientConnection',
                        totalCount: 5,
                        edges: [
                            {
                                node: {
                                    id: '1',
                                    name: {
                                        first: 'joe',
                                        last: 'bob'
                                    }
                                }
                            },
                            {
                                node: {
                                    id: '2',
                                    name: {
                                        first: 'jane',
                                        last: 'smith'
                                    }
                                }
                            }
                        ]
                    }
                }
            };
            const retData = this.plGraphQLService.toSimpleData(rawData);
            const simpleData = {
                type: 'clients',
                clients_totalCount: 5,
                clients: [
                    {
                        id: '1',
                        name: {
                            first: 'joe',
                            last: 'bob'
                        }
                    },
                    {
                        id: '2',
                        name: {
                            first: 'jane',
                            last: 'smith'
                        }
                    }
                ]
            };
            expect(retData).toEqual(simpleData);
        });
    });

    describe('query', () => {
        it('should query with success', (done) => {
            const xName = 'testSuccessQuery';
            const response = {
                p1: '1',
                p2: '2',
            };
            this.apollo.addMockedResponse(xName, response);
            this.plGraphQLService.query(`query Clients($first: Int!) {
                clients(first: 20) {
                    totalCount
                }
            }`, {}, { simplify: false }, { xName: xName })
                .subscribe((res: any) => {
                    expect(res).toEqual(response);
                    done();
                });
        });

        it('should query with success errors', (done) => {
            const xName = 'testSuccessErrorsQuery';
            const errors = [
                {
                    code: 'bad_code',
                },
            ];
            const response = {
                errors: errors,
                p1: '1',
                p2: '2',
            };
            this.apollo.addMockedResponse(xName, response);
            this.plGraphQLService.query(`query Clients($first: Int!) {
                clients(first: 20) {
                    totalCount
                }
            }`, {}, { simplify: false }, { xName: xName })
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(response);
                    done();
                });
        });

        it('should query with error', (done) => {
            const xName = 'testErrorQuery';
            const responseErr = {
                errors: [
                    {
                        code: 'not_authenticated',
                    },
                ],
            };
            this.apollo.addMockedResponse(xName, null, responseErr);
            this.plGraphQLService.query(`query Clients($first: Int!) {
                clients(first: 20) {
                    totalCount
                }
            }`, null, { simplify: false }, { xName: xName })
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(responseErr);
                    done();
                });
        });
    });

    describe('mutate', () => {
        it('should mutate with success', (done) => {
            const xName = 'testSuccessMutate';
            const response = {
                data: {
                    p1: '1',
                    p2: '2',
                },
            };
            this.apollo.addMockedResponse(xName, response);
            const variables = {
                client: {
                    id: 1,
                    firstName: 'Joe',
                },
            };
            this.plGraphQLService.mutate(`mutation updateClient($client: ClientInput) {
                updateClient(input: { client: $client }) {
                    client {
                        id
                    }
                }
            }`, variables, { simplify: false, debug: true }, { xName: xName })
                .subscribe((res: any) => {
                    expect(res).toEqual(response);
                    done();
                });
        });

        it('should mutate with success errors', (done) => {
            const xName = 'testSuccessErrorsMutate';
            const errors = [
                {
                    code: 'authentication_failed',
                },
            ];
            const response = {
                data: {
                    obj1: {
                        errors: errors,
                    },
                    p1: '1',
                    p2: '2',
                },
            };
            this.apollo.addMockedResponse(xName, response);
            const variables = {
                client: {
                    id: 1,
                    firstName: 'Joe',
                },
            };
            this.plGraphQLService.mutate(`mutation updateClient($client: ClientInput) {
                updateClient(input: { client: $client }) {
                    client {
                        id
                    }
                }
            }`, variables, { simplify: false, debug: true }, { xName: xName })
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(response);
                    done();
                });
        });

        it('should mutate with error', (done) => {
            const xName = 'testErrorMutate';
            const responseErr = {
                errors: [
                    {
                        message: 'error 1',
                    }
                ],
            };
            this.apollo.addMockedResponse(xName, null, responseErr);
            const variables = {
                client: {
                    id: 1,
                    firstName: 'Joe',
                },
            };
            this.plGraphQLService.mutate(`mutation updateClient($client: ClientInput) {
                updateClient(input: { client: $client }) {
                    client {
                        id
                    }
                }
            }`, null, { simplify: false, debug: true }, { xName: xName })
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(responseErr);
                    done();
                });
        });
    });
});
