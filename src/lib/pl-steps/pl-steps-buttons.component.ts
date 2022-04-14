import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PLLinkService } from '../pl-link/pl-link.service';

import { PLStepsService } from './pl-steps.service';

@Component({
    selector: 'pl-steps-buttons',
    templateUrl: './pl-steps-buttons.component.html',
    styleUrls: ['./pl-steps-buttons.component.less'],
    inputs: ['steps', 'currentStepIndex', 'nextText', 'finishText', 'refresh'],
})
export class PLStepsButtonsComponent {
    @Output() onFinish = new EventEmitter<any>();
    @Output() onCancel = new EventEmitter<any>();
    @Output() onNext = new EventEmitter<any>();
    @Output() onPrev = new EventEmitter<any>();

    steps: any[] = [];
    currentStepIndex: number = 0;
    nextText: string = 'Next';
    finishText: string = 'Finish';
    refresh: boolean = false;

    currentNextText: string = this.nextText;
    currentStep: any = {};

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private plSteps: PLStepsService,
        private plLink: PLLinkService
    ) {
        router.events.subscribe((val: any) => {
            this.setCurrentStep();
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.init();
    }

    init() {
        this.setCurrentStep();
    }

    setCurrentStep() {
        if (this.steps && this.steps.length) {
            this.currentStepIndex = this.plSteps.getCurrentStep(
                this.steps,
                this.route.routeConfig.children,
                this.location.path()
            );
            this.setNextText();
            this.currentStep = Object.assign(
                {},
                {
                    prevDisabled: this.currentStepIndex === 0 ? true : false,
                    nextDisabled: false,
                },
                this.steps[this.currentStepIndex] || {}
            );
        }
    }

    onLastStep() {
        return this.currentStepIndex === this.steps.length - 1 ? true : false;
    }

    setNextText() {
        this.currentNextText = this.onLastStep() ? this.finishText : this.nextText;
    }

    prevStep() {
        if (this.currentStepIndex > 0) {
            const prevIndex = this.currentStepIndex - 1;
            if (this.onPrev.observers.length) {
                this.onPrev.emit({
                    currentIndex: this.currentStepIndex,
                    prevIndex: prevIndex,
                });
            } else {
                if (this.steps[prevIndex].replaceHistory) {
                    this.plLink.navigate(this.steps[prevIndex].href, this.steps[prevIndex].hrefQueryParams);
                } else {
                    this.router.navigate([this.steps[prevIndex].href], {
                        queryParams: this.steps[prevIndex].hrefQueryParams,
                    });
                }
            }
        }
    }

    nextStep() {
        if (this.onLastStep()) {
            if (this.onFinish) {
                this.onFinish.emit({ currentIndex: this.currentStepIndex });
            }
        } else {
            const nextIndex = this.currentStepIndex + 1;
            if (this.onNext.observers.length) {
                this.onNext.emit({
                    currentIndex: this.currentStepIndex,
                    nextIndex: nextIndex,
                });
            } else {
                if (this.steps[nextIndex].replaceHistory) {
                    this.plLink.navigate(this.steps[nextIndex].href, this.steps[nextIndex].hrefQueryParams);
                } else {
                    this.router.navigate([this.steps[nextIndex].href], {
                        queryParams: this.steps[nextIndex].hrefQueryParams,
                    });
                }
            }
        }
    }

    cancel() {
        if (this.onCancel) {
            this.onCancel.emit({ currentIndex: this.currentStepIndex });
        }
    }
}
