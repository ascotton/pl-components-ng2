import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';
import { PLApiFileAmazonService } from './pl-api-file-amazon.service';

@Injectable()
export class PLApiAccountUploadDocumentsService {
    constructor(
        private plHttp: PLHttpService,
        private plFileAmazon: PLApiFileAmazonService,
        private plLodash: PLLodashService,
    ) {}

    uploadAccountFiles(files: any, type: string, metadata: any, filenames: string[] = []) {
        return new Observable((observer: any) => {
            this.plFileAmazon.getAmazonUrl({ namespace: type }).subscribe((resAmazon: any) => {
                const awsInfo = resAmazon;
                this.plFileAmazon
                    .uploadBulk(files, awsInfo.url, awsInfo.fields, `0_`, filenames)
                    .subscribe((resFiles: any) => {
                        this.saveFiles(resFiles, metadata).subscribe(
                            () => {
                                observer.next();
                            },
                            (err: any) => {
                                observer.error(err);
                            },
                        );
                    });
            });
        });
    }

    saveFiles(resFiles: any, metadata: any) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = () => {
                if (this.plLodash.allTrue(loaded)) {
                    observer.next();
                    observer.complete();
                }
            };
            resFiles.forEach((resFile: any, index: number) => {
                loaded[index] = false;
                this.saveOneFile(metadata, resFile).subscribe(
                    (res) => {
                        loaded[index] = true;
                        checkAllLoadedLocal();
                    },
                    (err: any) => {
                        observer.error(err);
                    },
                );
            });
        });
    }

    saveOneFile(metadata: any, resFile: any) {
        return new Observable((observer: any) => {
            const doc: any = {
                location_id: metadata.locationId,
                organization_id:  metadata.organizationId,
                file_path: resFile.key,
                file_name: metadata.fileName,
                document_type_id: metadata.documentTypeId,
                share_level: metadata.shareLevel,
                school_year: metadata.schoolYearId,
            };

            this.plHttp.save('accountDocuments', doc).subscribe(
                (res: any) => {
                    observer.next(res.data);
                },
                (err: any) => {
                    observer.error(err);
                },
            );
        });
    }

    delete(docUuid: string) {
        return this.plHttp.delete('accountDocuments', { uuid: docUuid });
    }

    deleteBulk(docUuids: string[]) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = () => {
                if (this.plLodash.allTrue(loaded)) {
                    observer.next();
                }
            };

            docUuids.forEach((docUuid: string, index: number) => {
                loaded[index] = false;
                this.delete(docUuid).subscribe(
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
}
