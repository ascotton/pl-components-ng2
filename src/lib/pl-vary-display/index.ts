import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLClientStudentDisplayComponent } from './pl-client-student-display.component';

@NgModule({
    imports: [CommonModule],
    exports: [PLClientStudentDisplayComponent],
    declarations: [PLClientStudentDisplayComponent],
    providers: [],
})
export class PLVaryDisplayModule { }

export { PLClientStudentDisplayService } from './pl-client-student-display.service';
