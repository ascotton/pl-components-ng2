import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLHttpService } from '../pl-http';
import { PLLodashService } from '../pl-lodash';

let plApiFileAmazon: any;

@Injectable()
export class PLApiFileAmazonService {
    private languages: any[] = [];

    constructor(private plHttp: PLHttpService, private plLodash: PLLodashService) {
        plApiFileAmazon = this;
    }

    getAmazonUrl(data: any) {
        return this.plHttp.save('upload', data);
    }

    getKey(keyOriginal: string, keyBatchPrefix: string, index: number, fileName: string) {
        const keyIndex = keyOriginal.lastIndexOf('/');
        const keyStart = keyOriginal.slice(0, keyIndex);
        const keyEnd = keyOriginal.slice(keyIndex, keyOriginal.length);
        let key = `${keyStart}/${keyBatchPrefix}${index}${keyEnd}`;
        // The AWS call returns a 204 no content but we need to send back the
        // evaluated key to our backend. So we'll replace it here.
        key = key.replace('${filename}', fileName);
        return key;
    }

    uploadBulk(files: any, url: string, fieldData: any, keyBatchPrefix: string = '', filenames: string[] = []) {
        const loaded: any = [];
        return new Observable((observer: any) => {
            const checkAllLoadedLocal = function() {
                if (plApiFileAmazon.plLodash.allTrue(loaded)) {
                    observer.next(resFiles);
                }
            };

            const resFiles: any = [];
            const keyOriginal = fieldData.key;
            files.forEach((file: any, index: number) => {
                loaded[index] = false;

                let filename = file.name;
                if (filenames[index]) {
                    filename = filenames[index];
                }
                // Can NOT update file name, so update key to ensure unique.
                fieldData.key = this.getKey(keyOriginal, keyBatchPrefix, index, filename);

                this.uploadOne(file, url, fieldData).subscribe(
                    (resFile: any) => {
                        resFiles.push(resFile);
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

    uploadOne(file: any, url: string, fieldData: any) {
        return new Observable((observer: any) => {
            const fields = Object.assign(
                {},
                {
                    acl: 'private',
                },
                fieldData
            );

            const formData = new FormData();
            for (let key in fields) {
                formData.append(key, fields[key]);
            }
            formData.append('file', file);

            const request = new XMLHttpRequest();
            request.open('POST', url);
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE && (request.status === 200 || request.status === 204)) {
                    observer.next({ key: fields.key, name: file.name });
                }
            };
            request.send(formData);
        });
    }
}
