import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../../pl-http';
import { PLLodashService } from '../../pl-lodash';
import { PLApiServicesService } from '../pl-api-services.service';
import { PLApiServiceTypesService } from '../pl-api-service-types.service';
import { PLApiAreasOfConcernService } from '../pl-api-areas-of-concern.service';
import { PLApiAssessmentsService } from '../pl-api-assessments.service';

let plApiServiceOpts: any;

@Injectable()
export class PLApiServiceOptsService {
    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plServices: PLApiServicesService,
        private plServiceTypes: PLApiServiceTypesService,
        private plAreasOfConcern: PLApiAreasOfConcernService,
        private plAssessments: PLApiAssessmentsService
    ) {
        plApiServiceOpts = this;
    }

    getAll(clientService: any) {
        return new Observable((observer: any) => {
            this.getServicesAndTypes().subscribe(() => {
                const info = this.serviceTypeByClientService(clientService);

                this.assessmentsAndAreasOfConcernByServiceType(info.serviceType.uuid).subscribe((res1: any) => {
                    observer.next({
                        service: info.service,
                        serviceType: info.serviceType,
                        assessmentsUsed: res1.assessmentsUsed,
                        areasOfConcern: res1.areasOfConcern,
                    });
                });
            });
        });
    }

    getServicesAndTypes() {
        let services: any = [];
        let serviceTypes: any = [];
        const loaded: any = {};
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiServiceOpts.plLodash.allTrue(loaded)) {
                    observer.next({ services, serviceTypes });
                }
            };

            loaded.services = false;
            this.plServices.get().subscribe((resServices: any) => {
                services = resServices;
                loaded.services = true;
                checkAllLoadedLocal();
            });

            loaded.serviceTypes = false;
            this.plServiceTypes.get().subscribe((resServiceTypes: any) => {
                serviceTypes = resServiceTypes;
                loaded.serviceTypes = true;
                checkAllLoadedLocal();
            });
        });
    }

    assessmentsAndAreasOfConcernByServiceType(serviceTypeUuid: string) {
        let assessmentsUsed: any = [];
        let areasOfConcern: any = [];
        const loaded: any = {};
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiServiceOpts.plLodash.allTrue(loaded)) {
                    observer.next({ assessmentsUsed, areasOfConcern });
                }
            };

            loaded.assessmentsUsed = false;
            this.plAssessments.get({ service_types: serviceTypeUuid }).subscribe((resAssessmentsUsed: any) => {
                assessmentsUsed = resAssessmentsUsed;
                loaded.assessmentsUsed = true;
                checkAllLoadedLocal();
            });

            loaded.areasOfConcern = false;
            this.plAreasOfConcern.get({ service_type: serviceTypeUuid }).subscribe((resAreasOfConcern: any) => {
                areasOfConcern = resAreasOfConcern;
                loaded.areasOfConcern = true;
                checkAllLoadedLocal();
            });
        });
    }

    serviceTypeByClientService(clientService: any) {
        const service = this.plServices.getInfo(clientService.service);
        const serviceType =
            typeof service.service_type === 'string'
                ? this.plServiceTypes.getInfo(service.service_type)
                : service.service_type;
        return { service, serviceType };
    }
}
