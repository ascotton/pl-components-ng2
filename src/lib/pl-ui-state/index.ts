import { NgModule } from '@angular/core';

import { PLCookieService } from '../pl-cookie';
import { PLUIStateService } from './pl-ui-state.service';

@NgModule({
    providers: [PLUIStateService, PLCookieService]
})
export class PLUIStateModule {}

export { PLUIStateService } from './pl-ui-state.service';
