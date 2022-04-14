import { Injectable } from '@angular/core';

import { PLCookieService } from '../pl-cookie';

@Injectable()
export class PLUIStateService {
    private static readonly KEY_PREFIX: string = 'plUiState';
    private static readonly ASSUMED_LOGIN_BAR_EXPANDED: string = `${PLUIStateService.KEY_PREFIX}.assume-login-bar-expanded`;
    private static readonly KEY_STATE_DEV_HIDE_ASSUMED_LOGIN: string = 'dev.hijack-hide';

    constructor(private plCookieService: PLCookieService) {}

    setState(key: string, value: string): String {
        this.plCookieService.setItem(key, value);

        return value;
    }

    getState(key: string, defaultValue?: string): string {
        const storedValue = this.plCookieService.getItem(key);

        return (storedValue === null) ? defaultValue : storedValue;
    }

    get assumedLoginBarExpanded(): boolean {
        return this.getState(PLUIStateService.ASSUMED_LOGIN_BAR_EXPANDED, 'true') === 'true';
    }

    set assumedLoginBarExpanded(isExpanded: boolean) {
        this.setState(PLUIStateService.ASSUMED_LOGIN_BAR_EXPANDED, isExpanded.toString());
    }

    get hideAssumedLogin(): boolean {
      return this.getState(PLUIStateService.KEY_STATE_DEV_HIDE_ASSUMED_LOGIN) === 'true';
    }

    set hideAssumedLogin(toggle: boolean) {
        this.setState(PLUIStateService.KEY_STATE_DEV_HIDE_ASSUMED_LOGIN, toggle.toString());
    }
}
