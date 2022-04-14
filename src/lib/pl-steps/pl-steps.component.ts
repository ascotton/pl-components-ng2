import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PLStepsService } from './pl-steps.service';

@Component({
    selector: 'pl-steps',
    templateUrl: './pl-steps.component.html',
    styleUrls: ['./pl-steps.component.less'],
    inputs: ['steps', 'currentStepIndex', 'verticalWidth', 'refresh'],
})
export class PLStepsComponent {
    // @Output() onChangeStep = new EventEmitter<any>();

    steps: any[] = [];
    currentStepIndex: number = 0;
    verticalWidth: number = 600;
    // Changes is not always firing properly..
    refresh: boolean = false;

    stepsDisplay: any[] = [];
    classesContainer: any = {
        vertical: true,
        horizontal: false,
    };
    subscribers: any = {
        router: null,
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private plSteps: PLStepsService
    ) {
        this.subscribers.router = router.events.subscribe((val: any) => {
            this.setCurrentStep();
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }

    ngOnDestroy() {
        this.subscribers.router.unsubscribe();
    }

    init() {
        this.setCurrentStep();
        this.onResize();
    }

    setCurrentStep() {
        if (this.steps && this.steps.length) {
            this.currentStepIndex = this.plSteps.getCurrentStep(
                this.steps,
                this.route.routeConfig.children,
                this.location.path(true) // include hash fragment, if any
            );
            this.formatSteps();
        }
    }

    formatSteps() {
        this.stepsDisplay = this.plSteps.formatSteps(this.steps, this.currentStepIndex);
    }

    onResizeEle(evt: any) {
        this.onResize();
    }

    onResize(setWidth: number = -1) {
        let width;
        if (setWidth > -1) {
            width = setWidth;
        } else {
            width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        }
        const vertical = width < this.verticalWidth ? true : false;
        this.classesContainer.horizontal = vertical ? false : true;
        this.classesContainer.vertical = vertical ? true : false;
    }
}
