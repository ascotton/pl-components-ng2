import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../../pl-http';
import { PLLodashService } from '../../pl-lodash';
import { PLApiClientsService } from '../pl-api-clients.service';
import { PLApiClientServicesService } from './pl-api-client-services.service';
import { PLApiServiceUploadDocumentsService } from './pl-api-service-upload-documents.service';

let plApiServiceSave: any;

@Injectable()
export class PLApiServiceSaveService {
    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plClients: PLApiClientsService,
        private plClientServices: PLApiClientServicesService,
        private plServiceUploadDocuments: PLApiServiceUploadDocumentsService
    ) {
        plApiServiceSave = this;
    }

    save(serviceObj: any = {}, client: any, documents: any) {
        const loaded: any = {};
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiServiceSave.plLodash.allTrue(loaded)) {
                    plApiServiceSave.saveDocuments(documents, clientService).subscribe(
                        (res: any) => {
                            observer.next({});
                        },
                        (err: any) => {
                            observer.error(err);
                        }
                    );
                }
            };

            if (client) {
                loaded.client = false;
                this.plClients.save(client).subscribe(
                    (resClient: any) => {
                        loaded.client = true;
                        checkAllLoadedLocal();
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            }

            let type: any = null;
            let clientService: any = null;
            if (serviceObj.evaluation) {
                type = 'evaluation';
                clientService = serviceObj.evaluation;
            } else if (serviceObj.directService) {
                type = 'directService';
                clientService = serviceObj.directService;
            }
            if (type) {
                loaded.clientService = false;
                this.plClientServices.save(clientService, type).subscribe(
                    (resClientService: any) => {
                        clientService = resClientService;
                        loaded.clientService = true;
                        checkAllLoadedLocal();
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            } else {
                observer.error({});
            }
        });
    }

    saveDocuments(documents: any, clientService: any) {
        const loaded: any = {};
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiServiceSave.plLodash.allTrue(loaded)) {
                    observer.next({});
                }
            };

            if (documents.schoolConsentFiles && documents.schoolConsentFiles.length) {
                loaded.school = false;
                this.plServiceUploadDocuments
                    .saveType(
                        documents.schoolConsentFiles,
                        'school_consent_form',
                        clientService,
                        documents.schoolConsentSignedOn
                    )
                    .subscribe(
                        () => {
                            loaded.school = true;
                            checkAllLoadedLocal();
                        },
                        (err: any) => {
                            observer.error(err);
                        }
                    );
            }
            if (documents.parentConsentFiles && documents.parentConsentFiles.length) {
                loaded.parent = false;
                this.plServiceUploadDocuments
                    .saveType(documents.parentConsentFiles, 'parent_consent', clientService)
                    .subscribe(
                        () => {
                            loaded.parent = true;
                            checkAllLoadedLocal();
                        },
                        (err: any) => {
                            observer.error(err);
                        }
                    );
            }
            if (documents.recordingConsentFiles && documents.recordingConsentFiles.length) {
                loaded.parent = false;
                this.plServiceUploadDocuments
                    .saveType(documents.recordingConsentFiles, 'parent_consent_recording', clientService)
                    .subscribe(
                        () => {
                            loaded.parent = true;
                            checkAllLoadedLocal();
                        },
                        (err: any) => {
                            observer.error(err);
                        }
                    );
            }
            checkAllLoadedLocal();
        });
    }
}
