import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PLIconModule } from '../pl-icon/index';

import { PLAssumedLoginBarComponent } from './pl-assumed-login-bar.component'
import { PLAssumeLoginService } from './pl-assume-login.service';

import { PLAbstractUserIDService } from './pl-abstract-user-id.service';
import { PLAbstractRealUserIDService } from './pl-abstract-real-user-id.service';

@NgModule({
    imports: [CommonModule, PLIconModule],
    exports: [PLAssumedLoginBarComponent],
    declarations: [PLAssumedLoginBarComponent],
    providers: [PLAssumeLoginService],
})
export class PLAssumeLoginModule {}

export { PLAssumedLoginBarComponent } from './pl-assumed-login-bar.component'
export { PLAssumeLoginService } from './pl-assume-login.service';
export { PLAbstractUserIDService } from './pl-abstract-user-id.service';
export { PLAbstractRealUserIDService } from './pl-abstract-real-user-id.service';
