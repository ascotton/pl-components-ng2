import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLButtonComponent } from './pl-button.component';
import { PLToggleComponent } from './pl-toggle.component';
import { PLButtonGroupComponent } from './pl-button-group.component';
import { BurstDirective } from '../core/burst.directive';

@NgModule({
    imports: [CommonModule],
    exports: [PLButtonComponent, PLToggleComponent, PLButtonGroupComponent],
    declarations: [PLButtonComponent, PLToggleComponent, PLButtonGroupComponent, BurstDirective],
})
export class PLButtonModule { }
