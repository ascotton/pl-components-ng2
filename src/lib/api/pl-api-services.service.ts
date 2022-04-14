import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiAbstractService } from './pl-api-abstract.service';

@Injectable()
export class PLApiServicesService {
    private services: any[] = [];
    private _psychoeducationalCombined: any = {
        uuid: '__eval_aoc_combined',
        code: '__eval_aoc_combined',
        name: 'Psychoeducational Evaluation — Assessment',
    };
    // Hardcoded - must match what is set in backend.
    private _serviceCategories: any = {
        evaluation_with_assessment: [
            'eval_ot',
            'eval_slt',
            'eval_mhp',
            'eval_aoc_3',
            'eval_aoc_2',
            'eval_aoc_1',
            this._psychoeducationalCombined.code,
        ],
        evaluation_screening: ['screening_mhp', 'screening_ot', 'screening_slp'],
        evaluation_record_review: ['records_review_mhp', 'records_review_ot', 'records_review_slp'],
        therapy: [
            'direct_ot',
            'direct_bmh',
            'direct_slt',
            'direct_sped',
            'consultation_ot',
            'consultation_slt',
            'consultation_bmh',
        ],
    };
    private _referralMap: any = {
        eval_ot: { category: 'evaluation', type: 'ot', providerType: 'ot' },
        eval_slt: { category: 'evaluation', type: 'slt', providerType: 'slp' },
        eval_mhp: { category: 'evaluation', type: 'bmh', providerType: 'mhp' },
        direct_ot: { category: 'direct', type: 'ot', providerType: 'ot' },
        direct_slt: { category: 'direct', type: 'slt', providerType: 'slp' },
        direct_bmh: { category: 'direct', type: 'bmh', providerType: 'mhp' },
    };
    private _psychoeducationalCombinedCodes: any = ['eval_aoc_1', 'eval_aoc_2', 'eval_aoc_3'];
    private _psychoeducationalCombinedUuids: any = [];

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plApiAbstract: PLApiAbstractService
    ) {}

    get(params1: any = {}) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('services', {limit: 1000, ...params1}).subscribe((res: any) => {
                this.services = res;
                observer.next(res);
            });
        });
    }

    getInfo(uuid: string) {
        if (uuid === this._psychoeducationalCombined.uuid) {
            return this._psychoeducationalCombined;
        }
        const index = this.plLodash.findIndex(this.services, 'uuid', uuid);
        return index > -1 ? this.services[index] : null;
    }

    getFromKey(key: string, keyValue: any, services1: any[] = null) {
        const services = services1 || this.services;
        const index = this.plLodash.findIndex(services, key, keyValue);
        return index > -1 ? services[index] : null;
    }

    filterByServiceType(services: any, serviceTypeUuid: string) {
        if (!services) {
            return services;
        }
        return services.filter((service: any) => {
            return service.service_type.uuid === serviceTypeUuid ? true : false;
        });
    }

    filterByCategories(services: any, categories: any = null) {
        if (!categories || !categories.length || !services) {
            return services;
        }
        let pickFields: any = [];
        categories.forEach((category: any) => {
            pickFields = pickFields.concat(this._serviceCategories[category]);
        });
        return services.filter((service: any) => {
            return pickFields.indexOf(service.code) > -1 ? true : false;
        });
    }

    getPsychoeducationalUuids(services: any) {
        // Reset.
        this._psychoeducationalCombinedUuids = [];
        if (!services) {
            return this._psychoeducationalCombinedUuids;
        }
        services.forEach((service: any) => {
            if (this._psychoeducationalCombinedCodes.indexOf(service.code) > -1) {
                this._psychoeducationalCombinedUuids.push(service.uuid);
            }
        });
        return this._psychoeducationalCombinedUuids;
    }

    combinePsychoeducational(services: any) {
        let combined: any = [];
        if (!services) {
            return combined;
        }
        let foundOne = false;
        const combinedCodes = this._psychoeducationalCombinedCodes;
        services.forEach((service: any) => {
            if (combinedCodes.indexOf(service.code) > -1) {
                if (!foundOne) {
                    combined.push(
                        Object.assign({}, service, {
                            uuid: this._psychoeducationalCombined.code,
                            code: this._psychoeducationalCombined.code,
                            name: this._psychoeducationalCombined.name,
                        })
                    );
                    foundOne = true;
                }
            } else {
                combined.push(service);
            }
        });
        return combined;
    }

    selectPsychoeducationalService(services: any, selectedServiceUuid: string, areasOfConcern: any = []) {
        if (!selectedServiceUuid || !services || !services.length) {
            return selectedServiceUuid;
        }
        const uuidsToCheck = this.getPsychoeducationalUuids(services).concat([this._psychoeducationalCombined.uuid]);
        if (uuidsToCheck.indexOf(selectedServiceUuid) > -1) {
            let index = -1;
            if (areasOfConcern.length === 1) {
                index = this.plLodash.findIndex(services, 'code', 'eval_aoc_1');
            } else if (areasOfConcern.length === 2) {
                index = this.plLodash.findIndex(services, 'code', 'eval_aoc_2');
            } else if (areasOfConcern.length >= 3) {
                index = this.plLodash.findIndex(services, 'code', 'eval_aoc_3');
            }
            if (index > -1) {
                return services[index].uuid;
            }
        }
        return selectedServiceUuid;
    }

    getPsychoeducationalCombinedService(services: any, selectedServiceUuid: string) {
        if (!selectedServiceUuid || !services || !services.length) {
            return selectedServiceUuid;
        }
        const uuidsToCheck = this.getPsychoeducationalUuids(services);
        if (uuidsToCheck.indexOf(selectedServiceUuid) > -1) {
            return this._psychoeducationalCombined.uuid;
        }
        return selectedServiceUuid;
    }

    formSelectOpts(
        services: any,
        serviceTypeUuid: string = null,
        combinePsychoeducational: boolean = false,
        filterCategories: any = null
    ) {
        if (serviceTypeUuid) {
            services = this.filterByServiceType(services, serviceTypeUuid);
        }
        if (combinePsychoeducational) {
            services = this.combinePsychoeducational(services);
        }
        if (filterCategories) {
            services = this.filterByCategories(services, filterCategories);
        }
        return services.map((opt: any) => {
            return { value: opt.uuid, label: opt.name };
        });
    }

    getServiceCategory(serviceUuid: string) {
        if (!serviceUuid) {
            return null;
        }
        const service = this.getInfo(serviceUuid);
        if (!service) {
            return null;
        }
        for (let cat in this._serviceCategories) {
            if (this._serviceCategories[cat].indexOf(service.code) > -1) {
                return cat;
            }
        }
        return null;
    }

    maySelfRefer(serviceUuid: string, providerUuid: string) {
        const service = this.getInfo(serviceUuid);
        if (!service) {
            return false;
        } else {
            // Backend currently returns the `can_provide` field based on the logged in user,
            // so the `providerUuid` isn't needed right now. But it should become
            // more configurable later.
            return service.can_provide;
        }
    }

    getServiceFromTypeAndCategory(serviceTypeCode: string, category: string) {
        return new Observable((observer: any) => {
            let code = '';
            for (let key in this._referralMap) {
                if (this._referralMap[key].type === serviceTypeCode && this._referralMap[key].category === category) {
                    code = key;
                }
            }
            if (code) {
                const service = this.getFromKey('code', code);
                if (service) {
                    observer.next({ service: service });
                } else {
                    observer.error({ message: `No matching service code for ${serviceTypeCode}, ${category}` });
                }
            } else {
                observer.error({ message: `No matching service code for ${serviceTypeCode}, ${category}` });
            }
        });
    }
}
