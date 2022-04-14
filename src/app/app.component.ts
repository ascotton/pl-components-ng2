import { Component } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    currentUser: any = {};
    gitSha: string = '';
    pageLinks: any[] = [
        // { href: '/typography', label: 'Typography', icon: 'location' },
        // { href: '/config', label: 'Config', icon: 'location' },
        // { href: '/colors', label: 'Colors', icon: 'location' },
        // { href: '/buttons', label: 'Buttons', icon: 'location' },
        // { href: '/icons', label: 'Icons', icon: 'location' },
        { href: '/inputs', label: 'Inputs', icon: 'location' },
        // { href: '/tables', label: 'Tables', icon: 'location' },
        { href: '/table-framework', label: 'Table Framework', icon: 'location' },
        // { href: '/profile', label: 'Profile', icon: 'location' },
        { href: '/other', label: 'More', icon: 'location' },
    ];
    appLinks: any[] = [];
    supportLinks: any[] = [];
    userMenuLinks: any[] = [];
    logo: any = {};
    browserSupported: boolean = true;

    title = 'app works!';

    constructor() {
        this.gitSha = environment.git_sha ? environment.git_sha.slice(0, 4) : '';
    }
}
