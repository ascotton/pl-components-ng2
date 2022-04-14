import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PLLodashService } from '../pl-lodash/pl-lodash.service';
import { PLIconModule } from '../pl-icon/index';
import { PLDotLoaderModule } from '../pl-dot-loader/index';
// Circular dependency issue? So need to move mini calendar into input module.
// import {PLMiniCalendarModule} from "../pl-mini-calendar/index";
import { PLMiniCalendarComponent } from './pl-mini-calendar.component';
import { PLMiniCalendarService } from './pl-mini-calendar.service';

import { PLInputDropdownComponent } from './pl-input-dropdown.component';
import { PLInputDropdownService } from './pl-input-dropdown.service';

import { PLInputErrorsComponent } from './pl-input-errors.component';
import { PLInputErrorsService } from './pl-input-errors.service';

import { PLInputSharedService } from './pl-input-shared.service';

import { PLInputCheckboxComponent } from './pl-input-checkbox.component';
import { PLInputCheckboxGroupComponent } from './pl-input-checkbox-group.component';
import { PLInputDatepickerComponent } from './pl-input-datepicker.component';
import { PLInputFileComponent } from './pl-input-file.component';
import { PLInputLabelComponent } from './pl-input-label.component';
import { PLInputMultiSelectComponent } from './pl-input-multi-select.component';
import { PLInputMultiSelectApiComponent } from './pl-input-multi-select-api.component';
import { PLInputTextComponent } from './pl-input-text.component';
import { PLInputTextareaComponent } from './pl-input-textarea.component';
import { PLInputTimeComponent } from './pl-input-time.component';
import { PLInputTimeDoubleComponent } from './pl-input-time-double.component';
import { PLInputRadioComponent } from './pl-input-radio.component';
import { PLInputRadioGroupComponent } from './pl-input-radio-group.component';
import { PLInputSelectComponent } from './pl-input-select.component';
import { PLInputSelectApiComponent } from './pl-input-select-api.component';

import { PLBrowserModule } from '../pl-browser';
import { PipeModule } from '../pipes/index';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PLBrowserModule, PLIconModule, PLDotLoaderModule, PipeModule],
    exports: [
        PLMiniCalendarComponent,
        PLInputErrorsComponent,
        PLInputCheckboxComponent,
        PLInputCheckboxGroupComponent,
        PLInputDatepickerComponent,
        PLInputDropdownComponent,
        PLInputFileComponent,
        PLInputLabelComponent,
        PLInputMultiSelectComponent,
        PLInputMultiSelectApiComponent,
        PLInputTextComponent,
        PLInputTextareaComponent,
        PLInputTimeComponent,
        PLInputTimeDoubleComponent,
        PLInputRadioComponent,
        PLInputRadioGroupComponent,
        PLInputSelectComponent,
        PLInputSelectApiComponent,
    ],
    declarations: [
        PLMiniCalendarComponent,
        PLInputErrorsComponent,
        PLInputCheckboxComponent,
        PLInputCheckboxGroupComponent,
        PLInputDatepickerComponent,
        PLInputDropdownComponent,
        PLInputFileComponent,
        PLInputLabelComponent,
        PLInputMultiSelectComponent,
        PLInputMultiSelectApiComponent,
        PLInputTextComponent,
        PLInputTextareaComponent,
        PLInputTimeComponent,
        PLInputTimeDoubleComponent,
        PLInputRadioComponent,
        PLInputRadioGroupComponent,
        PLInputSelectComponent,
        PLInputSelectApiComponent,
    ],
    providers: [
        PLInputDropdownService,
        PLInputErrorsService,
        PLInputSharedService,
        PLMiniCalendarService,
        PLLodashService,
    ],
})
export class PLInputModule {
    static forRoot(): ModuleWithProviders<PLInputModule> {
        return {
            ngModule: PLInputModule,
            providers: [PLInputDropdownService, PLInputErrorsService, PLInputSharedService, PLMiniCalendarService],
        };
    }
}

export { PLFormService } from './pl-form.service';
