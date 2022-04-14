import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class PLCookieService {
    private static readonly domain = environment.cookie_domain;

    setItem(name: string, value: any, days: number = 1000): void {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + value + expires + `; path=/; domain=${PLCookieService.domain}`;
    }

    getItem(name: string): string {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
}
