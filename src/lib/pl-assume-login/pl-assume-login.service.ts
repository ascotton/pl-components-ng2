import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from "rxjs";

import { PLHttpAuthService } from '../pl-http';
import { PLJWTDecoder } from '../pl-http';
import { PLUIStateService } from '../pl-ui-state';

import { PLAbstractUserIDService } from './pl-abstract-user-id.service';
import { PLAbstractRealUserIDService } from './pl-abstract-real-user-id.service';

@Injectable()
export class PLAssumeLoginService {
    private _isAssumedLogin$ = new ReplaySubject<boolean>(1);
    constructor(
      private userIDService: PLAbstractUserIDService,
      private realUserIDService: PLAbstractRealUserIDService,
      private plHttpAuth: PLHttpAuthService,
      private plUiStateService: PLUIStateService) {
          this._isAssumedLogin$.next(false);

          combineLatest(userIDService.userID(), realUserIDService.realUserID()).subscribe((pair: any[]) => {
              this._isAssumedLogin$.next(this.isAssumedLogin(pair[0], pair[1]));
          });
    }

    private isAssumedLogin(currentUserID: string, realUserID: string): boolean {
        return !this.plUiStateService.hideAssumedLogin
          && !!((currentUserID && realUserID) && (currentUserID != realUserID));
    }

    get getAssumedLogin() {
        return this._isAssumedLogin$.asObservable();
    }

    assume(email: string): void {
        this.plHttpAuth.assumeLogin(email);
    }

    release(): void {
        this.plHttpAuth.releaseLogin();
    }

    setHideAssumedLogin(toggle: boolean) {
        this.plUiStateService.hideAssumedLogin = toggle;
    }
}
