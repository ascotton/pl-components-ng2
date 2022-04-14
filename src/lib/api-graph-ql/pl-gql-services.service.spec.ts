import {Apollo, gql} from 'apollo-angular';
import { TestBed, async } from '@angular/core/testing';




import { PLGraphQLErrorService } from '../pl-graph-ql/pl-graph-ql-error.service';
import { PLToastService } from '../pl-toast';

import { PLLodashService } from '../pl-lodash';
import { PLGraphQLService } from '../pl-graph-ql';
import { PLUrlsService } from '../pl-http';

import { PLGQLServicesService } from './pl-gql-services.service';

import { ApolloStub } from '../../testing/apollo-stub';
import { PLToastStub } from '../../testing/pl-toast-stub';

describe('PLGQLServicesService', function() {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PLGQLServicesService,
                PLUrlsService,
                { provide: PLGraphQLService, useClass: PLGraphQLService },
                { provide: PLLodashService, useClass: PLLodashService },
                { provide: Apollo, useClass: ApolloStub },
                { provide: PLGraphQLErrorService, useClass: PLGraphQLErrorService },
                { provide: PLToastService, useClass: PLToastStub },
            ]
        });
        this.plGQLServices = TestBed.get(PLGQLServicesService);
        this.apollo = TestBed.get(Apollo);
    });

    function getContractInputs() {
        return {
            serviceId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            locationId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            atDate: new Date(2017, 9, 4),
            providerTypeId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            bilingual: false,
        };
    }

    describe('getIsServiceInContract', () => {
        it('should query with success', (done) => {
            const xName = 'getIsServiceInContract';
            const inputs = getContractInputs();
            const response = {
                data: {
                    service: {
                        id: inputs.serviceId,
                        code: 'dddd',
                        isInContract: true,
                    },
                },
            };
            this.apollo.addMockedResponse(xName, response);
            this.plGQLServices.getIsServiceInContract(inputs.serviceId, inputs.locationId, inputs.atDate,
             inputs.providerTypeId, inputs.bilingual)
                .subscribe((isInContract: boolean) => {
                    expect(isInContract).toEqual(response.data.service.isInContract);
                    done();
                });

        });

        it('should query with success errors', (done) => {
            const xName = 'getIsServiceInContract';
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
            const inputs = getContractInputs();
            this.apollo.addMockedResponse(xName, response);
            this.plGQLServices.getIsServiceInContract(inputs.serviceId, inputs.locationId, inputs.atDate,
             inputs.providerTypeId, inputs.bilingual)
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(response);
                    done();
                });
        });

        it('should query with error', (done) => {
            const xName = 'getIsServiceInContract';
            const responseErr = {
                errors: [
                    {
                        code: 'not_authenticated',
                    },
                ],
            };
            this.apollo.addMockedResponse(xName, null, responseErr);
            const inputs = getContractInputs();
            this.plGQLServices.getIsServiceInContract(inputs.serviceId, inputs.locationId, inputs.atDate,
             inputs.providerTypeId, inputs.bilingual)
                .subscribe((res: any) => {
                }, (err: any) => {
                    expect(err).toEqual(responseErr);
                    done();
                });
        });
    });

});
