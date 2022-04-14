import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { Modal1Module } from './other/modals/modal-1/';
import { Modal2Module } from './other/modals/modal-2/';

import { AppComponent } from './app.component';

import { PLAppNavModule } from '../lib/pl-app-nav/index';
import { PLButtonModule } from '../lib/pl-button/index';
import { PLCarouselModule } from '../lib/pl-carousel/index';
import { PLBrowserModule } from '../lib/pl-browser/index';
import { PLClosablePageHeaderModule } from '../lib/pl-closable-page-header/index';
import { PLConfigModule } from '../lib/pl-config/index';
import { PLDotLoaderModule } from '../lib/pl-dot-loader/index';
import { PLGraphQLModule } from '../lib/pl-graph-ql/index';
import { PLIconModule } from '../lib/pl-icon/index';
import { PLInputModule } from '../lib/pl-input/index';
import { PLModalModule } from '../lib/pl-modal/index';
import { PLProgressModule } from '../lib/pl-progress/';
import { PLStepsModule } from '../lib/pl-steps/index';
import { PLTableModule } from '../lib/pl-table/index';
import { PLTableFrameworkModule } from '../lib/pl-table-framework/index';
import { PLTabsModule } from '../lib/pl-tabs/index';
import { PLToastModule } from '../lib/pl-toast/index';
import { PLDialogModule } from '../lib/pl-dialog/index';
import { PLHttpModule } from '../lib/pl-http/index';
import { PLFormatterService } from '../lib/pl-formatter/pl-formatter.service';
import { PLLodashService } from '../lib/pl-lodash/pl-lodash.service';

import { TypographyComponent } from './typography/typography.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ColorsComponent } from './colors/colors.component';
import { ConfigComponent } from './config/config.component';
import { DecorationComponent } from './decoration/decoration.component';
import { PLIconsDemoComponent } from './icons/pl-icons-demo.component';
import { TableDemoComponent } from './table/table-demo.component';
import { TableFrameworkDemoComponent } from './table-framework/table-framework-demo.component';
import { OtherDemoComponent } from './other/other-demo.component';
import { Step1Component } from './other/steps/step-1/step-1.component';
import { Step2Component } from './other/steps/step-2/step-2.component';
import { Step3Component } from './other/steps/step-3/step-3.component';
import { Modal1Component } from './other/modals/modal-1/modal-1.component';
import { Modal2Component } from './other/modals/modal-2/modal-2.component';
import { InputsDemoComponent } from './inputs/inputs-demo.component';
import { PLBrowserService } from '../lib/pl-browser/pl-browser.service';
import { PipeModule } from '../lib/pipes/index';
import { ProfileDemoComponent } from './profile/profile-demo.component';
import { PLProfileHeaderModule } from '../lib/pl-profile-header/index';
import { PLLinkModule } from '../lib/pl-link/index';
import { PLLiveagentModule } from '../lib/pl-liveagent/index';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        RouterModule.forRoot([
            {
                path: 'typography',
                component: TypographyComponent,
                data: { title: 'Typography' },
            },
            {
                path: 'colors',
                component: ColorsComponent,
                data: { title: 'Colors' },
            },
            {
                path: 'config',
                component: ConfigComponent,
                data: { title: 'Config' },
            },
            {
                path: 'buttons',
                component: ButtonsComponent,
                data: { title: 'Buttons' },
            },
            {
                path: 'carousel',
                component: CarouselComponent,
                data: { title: 'Carousel' },
            },
            {
                path: 'decoration',
                component: DecorationComponent,
                data: { title: 'Decoration' },
            },
            {
                path: 'icons',
                component: PLIconsDemoComponent,
                data: { title: 'Icons' },
            },
            {
                path: 'inputs',
                component: InputsDemoComponent,
                data: { title: 'Inputs' },
            },
            {
                path: 'tables',
                component: TableDemoComponent,
                data: { title: 'Tables' },
            },
            {
                path: 'table-framework',
                component: TableFrameworkDemoComponent,
                data: { title: 'Table Framework' },
            },
            {
                path: 'profile',
                component: ProfileDemoComponent,
                data: { title: 'Profile' },
            },
            {
                path: 'other',
                component: OtherDemoComponent,
                data: { title: 'Other' },
                children: [
                    { path: '', redirectTo: 'step-1', pathMatch: 'full' },
                    {
                        path: 'step-1',
                        component: Step1Component,
                        data: { title: 'Other - Step 1' },
                    },
                    {
                        path: 'step-2',
                        component: Step2Component,
                        data: { title: 'Other - Step 2' },
                    },
                    {
                        path: 'step-3',
                        component: Step3Component,
                        data: { title: 'Other - Step 3' },
                    },
                ],
            },
            { path: '', redirectTo: '/typography', pathMatch: 'full' },
            { path: '**', redirectTo: '' },
        ]),

        Modal1Module,
        Modal2Module,

        // Components
        PLAppNavModule,
        PLButtonModule,
        PLCarouselModule,
        PLBrowserModule,
        PLClosablePageHeaderModule,
        PLConfigModule,
        PLDotLoaderModule,
        PLGraphQLModule,
        PLIconModule,
        PLInputModule,
        PLModalModule,
        PLProgressModule,
        PLStepsModule,
        PLTableModule,
        PLTableFrameworkModule,
        PLTabsModule,
        PLToastModule,
        PLDialogModule,
        PLProfileHeaderModule,
        PLLinkModule,
        PLLiveagentModule,

        // Services
        PLHttpModule,
        PipeModule,
    ],
    declarations: [
        AppComponent,
        ButtonsComponent,
        CarouselComponent,
        ColorsComponent,
        ConfigComponent,
        DecorationComponent,
        PLIconsDemoComponent,
        InputsDemoComponent,
        OtherDemoComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        TableDemoComponent,
        TableFrameworkDemoComponent,
        TypographyComponent,
        ProfileDemoComponent,
    ],
    entryComponents: [
        Modal1Component,
        Modal2Component,
    ],
    providers: [PLBrowserService, PLFormatterService, PLLodashService],
    bootstrap: [AppComponent],
})
export class AppModule {}
