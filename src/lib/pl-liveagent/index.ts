import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLButtonModule } from '../pl-button/index';
import { PLInputModule } from '../pl-input/index';

import { PLLiveagentPrechatComponent } from './pl-liveagent-prechat.component';

@NgModule({
    imports: [
        CommonModule,
        PLButtonModule,
        PLInputModule,
    ],
    exports: [PLLiveagentPrechatComponent],
    declarations: [PLLiveagentPrechatComponent],
})
export class PLLiveagentModule {}
