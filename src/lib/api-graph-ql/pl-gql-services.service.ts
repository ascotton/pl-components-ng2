import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';
import { PLLodashService } from '../pl-lodash';

@Injectable()
export class PLGQLServicesService {
    private services: any[] = [];

    private _psychoeducationalCombined: any = {
        id: '__eval_aoc_combined',
        code: '__eval_aoc_combined',
        name: 'Psychoeducational Evaluation — Assessment',
    };
    private _serviceCategories: any = {};
    private _referralMap: any = {
        eval_ot: { category: 'evaluation', type: 'ot', providerType: 'ot' },
        eval_slt: { category: 'evaluation', type: 'slt', providerType: 'slp' },
        eval_mhp: { category: 'evaluation', type: 'bmh', providerType: 'mhp' },
        eval_pa: { category: 'evaluation', type: 'pa', providerType: 'pa' },
        direct_ot: { category: 'direct', type: 'ot', providerType: 'ot' },
        direct_slt: { category: 'direct', type: 'slt', providerType: 'slp' },
        direct_bmh: { category: 'direct', type: 'bmh', providerType: 'mhp' },
    };
    private _psychoeducationalCombinedCodes: any = ['eval_aoc_1', 'eval_aoc_2', 'eval_aoc_3'];
    private _psychoeducationalCombinedIds: any = [];

    constructor(private plGraphQL: PLGraphQLService, private plLodash: PLLodashService) {}

    get(options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                first: 100,
            };
            this.plGraphQL
                .query(
                    `query Services($first: Int) {
                services(first: $first) {
                    edges {
                        node {
                            id
                            isActive
                            code
                            name
                            serviceType {
                                id
                            }
                            productType {
                                id
                                code
                            }
                            providerTypes {
                                edges {
                                    node {
                                        id
                                        code
                                        shortName
                                        longName
                                    }
                                }
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
                        this.services = res.services;
                        this.setServiceCategories(res.services);
                        observer.next(res);
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
        });
    }

    setServiceCategories(services: any[]) {
        const serviceCategories: any = {
            evaluation_with_assessment: [
                this._psychoeducationalCombined.code,
            ],
            evaluation_screening: [],
            evaluation_record_review: [],
            therapy: [],
        };
        const keyMap: any = {
            evaluation_with_assessments: 'evaluation_with_assessment',
            consultation: 'therapy',
            direct_service: 'therapy',
            records_review: 'evaluation_record_review',
            screening: 'evaluation_screening',
            supervision: 'therapy',
            groupbmh_bi: 'therapy', // BIGs
            groupbmh_ti: 'therapy', // Trauma
        };
        services.forEach((service: any) => {
            if (service.productType && keyMap[service.productType.code]) {
                serviceCategories[keyMap[service.productType.code]].push(service.code);
            }
        });
        this._serviceCategories = serviceCategories;
    }

    getInfo(id: string) {
        if (id === this._psychoeducationalCombined.id) {
            return this._psychoeducationalCombined;
        }
        const index = this.plLodash.findIndex(this.services, 'id', id);
        return index > -1 ? this.services[index] : null;
    }

    getFromKey(key: string, keyValue: any, services1: any[] = null) {
        const services = services1 || this.services;
        const index = this.plLodash.findIndex(services, key, keyValue);
        return index > -1 ? services[index] : null;
    }

    formOpts(services1: any = null, options1?: { labelKey?: string; valueKey?: string }) {
        const options: any = Object.assign(
            {
                labelKey: 'name',
                valueKey: 'id',
            },
            options1
        );
        const services = services1 || this.services;
        if (services && services.length) {
            return services.map((item: any) => {
                return { value: item[options.valueKey], label: item[options.labelKey] };
            });
        }
        return [];
    }

    filterByServiceType(services: any, serviceTypeId: string) {
        if (!services) {
            return services;
        }
        return services.filter((service: any) => {
            return service.serviceType.id === serviceTypeId ? true : false;
        });
    }

    filterByProviderType(services: any, providerTypeValue: string, providerTypeKey: string = 'code') {
        if (!services) {
            return services;
        }
        return services.filter((service: any) => {
            let providerTypesCodes = service.providerTypes.map((providerType: any) => {
                return providerType.code;
            });
            return providerTypesCodes.indexOf(providerTypeValue) > -1 ? true : false;
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

    getPsychoeducationalIds(services: any) {
        // Reset.
        this._psychoeducationalCombinedIds = [];
        if (!services) {
            return this._psychoeducationalCombinedIds;
        }
        services.forEach((service: any) => {
            if (this._psychoeducationalCombinedCodes.indexOf(service.code) > -1) {
                this._psychoeducationalCombinedIds.push(service.id);
            }
        });
        return this._psychoeducationalCombinedIds;
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
                            id: this._psychoeducationalCombined.code,
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

    selectPsychoeducationalService(services: any, selectedServiceId: string, areasOfConcern: any = []) {
        if (!selectedServiceId || !services || !services.length) {
            return selectedServiceId;
        }
        const idsToCheck = this.getPsychoeducationalIds(services).concat([this._psychoeducationalCombined.id]);
        if (idsToCheck.indexOf(selectedServiceId) > -1) {
            let index = -1;
            if (areasOfConcern.length === 1) {
                index = this.plLodash.findIndex(services, 'code', 'eval_aoc_1');
            } else if (areasOfConcern.length === 2) {
                index = this.plLodash.findIndex(services, 'code', 'eval_aoc_2');
            } else if (areasOfConcern.length >= 3) {
                index = this.plLodash.findIndex(services, 'code', 'eval_aoc_3');
            }
            if (index > -1) {
                return services[index].id;
            }
        }
        return selectedServiceId;
    }

    getPsychoeducationalCombinedService(services: any, selectedServiceId: string) {
        if (!selectedServiceId || !services || !services.length) {
            return selectedServiceId;
        }
        const idsToCheck = this.getPsychoeducationalIds(services);
        if (idsToCheck.indexOf(selectedServiceId) > -1) {
            return this._psychoeducationalCombined.id;
        }
        return selectedServiceId;
    }

    formSelectOpts(
        services: any,
        serviceTypeId: string = null,
        combinePsychoeducational: boolean = false,
        filterCategories: any = null
    ) {
        if (serviceTypeId) {
            services = this.filterByServiceType(services, serviceTypeId);
        }
        if (combinePsychoeducational) {
            services = this.combinePsychoeducational(services);
        }
        if (filterCategories) {
            services = this.filterByCategories(services, filterCategories);
        }
        return services.map((opt: any) => {
            return { value: opt.id, label: opt.name };
        });
    }

    formSelectOptsProviderType(
        services: any,
        providerTypeCode: string = null,
        combinePsychoeducational: boolean = false,
        filterCategories: any = null
    ) {
        if (providerTypeCode) {
            services = this.filterByProviderType(services, providerTypeCode);
        }
        if (combinePsychoeducational) {
            services = this.combinePsychoeducational(services);
        }
        if (filterCategories) {
            services = this.filterByCategories(services, filterCategories);
        }
        return services.map((opt: any) => {
            return { value: opt.id, label: opt.name };
        });
    }

    getServiceCategory(serviceId: string) {
        if (!serviceId) {
            return null;
        }
        const service = this.getInfo(serviceId);
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

    getServiceType(serviceId: string) {
        if (!serviceId) {
            return null;
        }
        const service = this.getInfo(serviceId);
        if (!service) {
            return null;
        }
        if (service.serviceType) {
            return service.serviceType.id;
        }
        return null;
    }

    maySelfRefer(serviceId: string, providerId: string) {
        const service = this.getInfo(serviceId);
        if (!service) {
            return false;
        } else {
            // Backend currently returns the `can_provide` field based on the logged in user,
            // so the `providerId` isn't needed right now. But it should become
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

    getServiceFromProviderTypeAndCategory(providerTypeCode: string, category: string) {
        return new Observable((observer: any) => {
            let code = '';
            for (let key in this._referralMap) {
                if (
                    this._referralMap[key].providerType === providerTypeCode &&
                    this._referralMap[key].category === category
                ) {
                    code = key;
                }
            }
            if (code) {
                const service = this.getFromKey('code', code);
                if (service) {
                    observer.next({ service: service });
                } else {
                    observer.error({ message: `No matching service code for ${providerTypeCode}, ${category}` });
                }
            } else {
                observer.error({ message: `No matching service code for ${providerTypeCode}, ${category}` });
            }
        });
    }

    getIsServiceInContract(serviceId: string, locationId: string, atDate: Date, providerTypeId: string, bilingual: boolean, options1: any = {}) {
        return new Observable((observer: any) => {
            const variables: any = {
                id: serviceId,
                locationId: locationId,
                atDate: atDate,
                providerTypeId: providerTypeId,
                bilingual: bilingual,
            };
            this.plGraphQL
                .query(`query IsServiceInContract($id: ID!, $locationId: ID, $atDate: DateTime,
                 $providerTypeId: ID, $bilingual: Boolean) {
                    service(id: $id) {
                        id
                        code
                        isInContract (locationId: $locationId, atDate: $atDate,
                         providerTypeId: $providerTypeId, bilingual: $bilingual)
                    }
                }`, variables, {}, { xName: 'getIsServiceInContract' })
                .subscribe(
                    (res: any) => {
                        const isInContract = (res.service && res.service.isInContract !== undefined)
                         ? res.service.isInContract : false;
                        observer.next(isInContract);
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
        });
    }
}
