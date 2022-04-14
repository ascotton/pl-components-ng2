import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../../pl-http';
import { PLLodashService } from '../../pl-lodash';
import { PLApiFileAmazonService } from '../pl-api-file-amazon.service';
import { PLApiClientServicesService } from './pl-api-client-services.service';

@Injectable()
export class PLApiServiceUploadDocumentsService {
    constructor(
        private plHttp: PLHttpService,
        private plLodash: PLLodashService,
        private plFileAmazon: PLApiFileAmazonService,
        private plClientServices: PLApiClientServicesService
    ) {}

    saveType(files: any, type: string, clientService: any, signedOn?: any, filenames: string[] = []) {
        return new Observable((observer: any) => {
            this.plFileAmazon.getAmazonUrl({ namespace: type }).subscribe((resAmazon: any) => {
                const awsInfo = resAmazon;
                this.plFileAmazon
                    .uploadBulk(files, awsInfo.url, awsInfo.fields, `0_`, filenames)
                    .subscribe((resFiles: any) => {
                        clientService.resFiles = resFiles;
                        this.plClientServices.saveFiles(clientService, type, signedOn).subscribe(
                            () => {
                                observer.next();
                            },
                            (err: any) => {
                                observer.error(err);
                            }
                        );
                    });
            });
        });
    }
}
