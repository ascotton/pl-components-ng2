import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLHttpService } from './pl-http.service';

@NgModule({
    imports: [CommonModule],
    exports: [],
    providers: [PLHttpService],
})
export class PLHttpModule { }

export { PLHttpService } from './pl-http.service';
export { PLHttpAuthService, getToken } from './pl-http-auth.service';
export { PLHttpErrorService } from './pl-http-error.service';
export { PLJWTDecoder } from './pl-jwt-decoder.model';
export { PLUrlsService } from './pl-urls.service';
