import { Component, OnInit } from '@angular/core';

import { PLAssumeLoginService } from './pl-assume-login.service';
import { PLUIStateService } from '../pl-ui-state';

@Component({
    selector: 'pl-assumed-login-bar',
    templateUrl: './pl-assumed-login-bar.component.html',
    styleUrls: ['./pl-assumed-login-bar.component.less'],
    inputs: ['username'],
})
export class PLAssumedLoginBarComponent implements OnInit {
    username: string = '';
    isAssumedLogin: boolean = false;

    constructor(private assumeLoginService: PLAssumeLoginService, private plUIStateService: PLUIStateService) {}

    ngOnInit(): void {
      this.assumeLoginService.getAssumedLogin.subscribe((isAssumedLogin: boolean) => {
          this.isAssumedLogin = isAssumedLogin;
      });
    }

    onReleaseClick(): void {
        this.plUIStateService.assumedLoginBarExpanded = true;

        this.assumeLoginService.release();
    }

    onTabClick(): void {
        this.plUIStateService.assumedLoginBarExpanded = !this.isExpanded;
    }

    get tabIcon(): string {
        return this.isExpanded ? 'chevron-down' : 'chevron-up';
    }

    get isExpanded(): boolean {
        return this.plUIStateService.assumedLoginBarExpanded;
    }
};
