import { Component, Input } from '@angular/core';

import { PLClientStudentDisplayService } from './pl-client-student-display.service';

@Component({
    selector: 'pl-client-student-display',
    templateUrl: './pl-client-student-display.component.html',
    styleUrls: ['./pl-client-student-display.component.less'],
})
export class PLClientStudentDisplayComponent {

    @Input('user') user: any = {};
    @Input('capitalize') capitalize: boolean = false;
    @Input('uppercase') uppercase: boolean = false;

    constructor() { }

    get displayText(): string {
        const options = { capitalize: this.capitalize, uppercase: this.uppercase };
        return PLClientStudentDisplayService.get(this.user, options);
    }
}
