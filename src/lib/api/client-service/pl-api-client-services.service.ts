import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { PLHttpService, PLUrlsService } from '../../pl-http';
import { PLLodashService } from '../../pl-lodash';
import { PLTimezoneService } from '../../pl-timezone';
import { PLApiAbstractService } from '../pl-api-abstract.service';
import { PLApiFileAmazonService } from '../pl-api-file-amazon.service';
import { PLApiServiceDocumentsService } from '../pl-api-service-documents.service';

let plApiClientServices: any;

@Injectable()
export class PLApiClientServicesService {
    private _clientServices: any[] = [];
    private _serviceLabelMap: any = {
        consultation_bmh: 'BMH Consultation',
        direct_bmh: 'BMH Direct',
        consultation_ot: 'OT Consultation',
        direct_ot: 'OT Direct',
        consultation_slt: 'SLT Consultation',
        direct_slt: 'SLT Direct',
    };

    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plUrls: PLUrlsService,
        private plTimezone: PLTimezoneService,
        private plFileAmazon: PLApiFileAmazonService,
        private plServiceDocuments: PLApiServiceDocumentsService,
        private plApiAbstract: PLApiAbstractService
    ) {
        plApiClientServices = this;
    }

    filterActive(clientServices: any, activeOnly: boolean, excludeLocked: boolean) {
        if (activeOnly) {
            clientServices = clientServices.filter((clientService: any) => {
                return clientService.is_active;
            });
        }
        if (excludeLocked) {
            clientServices = clientServices.filter((clientService: any) => {
                return !clientService.locked;
            });
        }
        return clientServices;
    }

    get(data: any = {}, getDocuments: boolean = false, activeOnly: boolean = true, excludeLocked: boolean = true) {
        return new Observable((observer: any) => {
            this.plApiAbstract.get('clientServices', data).subscribe(
                (res: any) => {
                    let clientServices: any[] = res;
                    clientServices = this.formatFromBackend(clientServices);
                    if (getDocuments) {
                        this.getDocuments(clientServices).subscribe((resClientServices: any) => {
                            this._clientServices = this.filterActive(resClientServices, activeOnly, excludeLocked);
                            observer.next(this._clientServices);
                            observer.complete();
                        });
                    } else {
                        this._clientServices = this.filterActive(clientServices, activeOnly, excludeLocked);
                        observer.next(this._clientServices);
                        observer.complete();
                    }
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }

    getDocuments(clientServices: any) {
        const loaded: any = [];
        const clientServicesOutput: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiClientServices.plLodash.allTrue(loaded)) {
                    observer.next(clientServicesOutput);
                    observer.complete();
                }
            };

            let httpUrl: string;
            let httpOpts: any;
            clientServices.forEach((clientService: any, index: number) => {
                loaded[index] = false;
                if (clientService.type === 'evaluation') {
                    httpUrl = `${this.plUrls.urls.evaluations}${clientService.uuid}/documents/`;
                    this.plApiAbstract.get('', {}, httpUrl).subscribe((resDocs: any) => {
                        if (resDocs && resDocs.results) {
                            clientService.documents_expanded = resDocs.results;
                        }
                        clientServicesOutput[index] = clientService;
                        loaded[index] = true;
                        checkAllLoadedLocal();
                    });
                } else {
                    clientServicesOutput[index] = clientService;
                    loaded[index] = true;
                    checkAllLoadedLocal();
                }
            });
        });
    }

    getClientServiceType(clientService: any) {
        if (clientService.type) {
            return clientService.type;
        }
        if (clientService.evaluation_type || clientService.evaluationType) {
            return 'evaluation';
        }
        if (clientService.start_date || clientService.startDate) {
            return 'directService';
        }
        return null;
    }

    getOneDocuments(clientService: any, options: {}) {
        return new Observable((observer: any) => {
            const type = this.getClientServiceType(clientService);
            if (type === 'evaluation') {
                const id = clientService.uuid || clientService.id;
                const httpUrl = `${this.plUrls.urls.evaluations}${id}/documents/`;
                this.plApiAbstract.get('', {}, httpUrl, options).subscribe((resDocs: any) => {
                    if (resDocs && resDocs.results) {
                        clientService.documents_expanded = resDocs.results;
                    } else if (resDocs) {
                        clientService.documents_expanded = resDocs;
                    }
                    observer.next(clientService);
                });
            } else {
                observer.next(clientService);
            }
        });
    }

    getOne(data: any = {}, getDocuments: boolean = true) {
        return new Observable((observer: any) => {
            this.get(data).subscribe((clientServices: any) => {
                if (getDocuments) {
                    this.getDocuments(clientServices).subscribe((resClientServices: any) => {
                        observer.next(resClientServices[0]);
                        observer.complete();
                    });
                } else {
                    observer.next(clientServices[0]);
                    observer.complete();
                }
            });
        });
    }

    formatFromBackend(clientServices: any) {
        return clientServices.map((clientService: any) => {
            // If details, just pull that out and use it.
            if (clientService.details) {
                let newService = Object.assign({}, clientService, clientService.details);
                delete newService.details;
                return newService;
            } else {
                return clientService;
            }
        });
    }

    formSelectOpts(clientServices: any, skipEnded: boolean = true) {
        clientServices = this.filterSelectOpts(clientServices, skipEnded);
        return clientServices.map((clientService: any) => {
            return { value: clientService.uuid, label: this.formSelectLabel(clientService) };
        });
    }

    formSelectLabel(clientService: any) {
        const start = clientService.start_date
            ? moment(clientService.start_date, this.plTimezone.dateTimeFormat).format('MM/YYYY')
            : '';
        const end = clientService.end_date
            ? moment(clientService.end_date, this.plTimezone.dateTimeFormat).format('MM/YYYY')
            : '';
        const time = start && end ? `${start} - ${end}` : start ? `${start} - no end date` : '';
        const label = this._serviceLabelMap[clientService.service_expanded.code]
            ? this._serviceLabelMap[clientService.service_expanded.code]
            : clientService.service_expanded.name;
        return `${label} ${time}`;
    }

    filterSelectOpts(clientServices: any, skipEnded: boolean = true) {
        const nowTime = moment();
        return clientServices.filter((clientService: any) => {
            return skipEnded &&
            clientService.end_date &&
            moment(clientService.end_date, this.plTimezone.dateTimeFormat) < nowTime
                ? false
                : true;
        });
    }

    getInfo(uuid: string) {
        const index = this.plLodash.findIndex(this._clientServices, 'uuid', uuid);
        return index > -1 ? this._clientServices[index] : null;
    }

    saveAll(clientServices: any) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiClientServices.plLodash.allTrue(loaded)) {
                    observer.next();
                    observer.complete();
                }
            };
            clientServices.forEach((clientService: any, index: number) => {
                loaded[index] = false;
                this.saveOne(clientService).subscribe(
                    () => {
                        loaded[index] = true;
                        checkAllLoadedLocal();
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            });
        });
    }

    saveOne(clientService: any) {
        return new Observable((observer: any) => {
            if (clientService.type === 'evaluation') {
                const pickKeys = ['uuid', 'areas_of_concern', 'status', 'assessments_used', 'service'];
                const evaluation = this.plLodash.pick(clientService, pickKeys);
                this.plHttp.save('evaluations', evaluation).subscribe(
                    (res: any) => {
                        observer.next(res.data);
                        observer.complete();
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            } else {
                observer.next({});
                observer.complete();
            }
        });
    }

    save(clientService: any = {}, type: string) {
        return new Observable((observer: any) => {
            let key: any = null;
            if (type === 'evaluation') {
                key = 'evaluations';
            } else if (type === 'directService') {
                key = 'directServices';
            }
            if (key) {
                this.plHttp.save(key, clientService).subscribe(
                    (res: any) => {
                        observer.next(res);
                        observer.complete();
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            } else {
                observer.next({});
                observer.complete();
            }
        });
    }

    uploadAllFiles(clientServices: any) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiClientServices.plLodash.allTrue(loaded)) {
                    observer.next(clientServices);
                    observer.complete();
                }
            };

            clientServices.forEach((clientService: any, index: number) => {
                loaded[index] = false;
                if (clientService.files && clientService.files.length) {
                    this.plFileAmazon
                        .uploadBulk(
                            clientService.files,
                            clientService.awsInfo.url,
                            clientService.awsInfo.fields,
                            `${index}_`
                        )
                        .subscribe((resFiles: any) => {
                            clientService.resFiles = resFiles;
                            loaded[index] = true;
                            checkAllLoadedLocal();
                        });
                } else {
                    loaded[index] = true;
                    checkAllLoadedLocal();
                }
            });
        });
    }

    saveAllFiles(clientServices: any) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiClientServices.plLodash.allTrue(loaded)) {
                    observer.next();
                    observer.complete();
                }
            };

            this.uploadAllFiles(clientServices).subscribe((resClientServices: any) => {
                resClientServices.forEach((clientService: any, index: number) => {
                    loaded[index] = false;
                    this.saveFiles(clientService).subscribe(() => {
                        loaded[index] = true;
                        checkAllLoadedLocal();
                    });
                });
            });
        });
    }

    saveFiles(clientService: any, docType: string = 'evaluation_report', signedOn: boolean = null) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiClientServices.plLodash.allTrue(loaded)) {
                    observer.next();
                    observer.complete();
                }
            };

            if (!clientService.resFiles || !clientService.resFiles.length) {
                observer.next();
                observer.complete();
            } else {
                clientService.resFiles.forEach((resFile: any, index: number) => {
                    loaded[index] = false;
                    this.saveOneFile(clientService, resFile, docType, signedOn).subscribe(
                        () => {
                            loaded[index] = true;
                            checkAllLoadedLocal();
                        },
                        (err: any) => {
                            observer.error(err);
                        }
                    );
                });
            }
        });
    }

    saveOneFile(clientService: any, resFile: any, docType: any, signedOn: boolean = null) {
        return new Observable((observer: any) => {
            const doc: any = {
                client_service: clientService.uuid,
                file_path: resFile.key,
                client: clientService.client,
            };
            if (signedOn) {
                doc.signed_on = signedOn;
            }
            this.plServiceDocuments.save(doc, docType).subscribe(
                () => {
                    observer.next();
                    observer.complete();
                },
                (err: any) => {
                    observer.error(err);
                }
            );
        });
    }
}
