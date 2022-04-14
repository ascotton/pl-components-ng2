import { Injectable } from '@angular/core';

@Injectable()
export class PLStepsService {
    constructor() {}

    getCurrentStep(steps: any[], routeChildren: any, locationPath: string) {
        let currentStepIndex = 0;
        let subRoute = locationPath.slice(locationPath.lastIndexOf('/') + 1, locationPath.length);
        const posQuestionMark = subRoute.indexOf('?');
        if (posQuestionMark > -1) {
            subRoute = subRoute.slice(0, posQuestionMark);
        }
        steps.forEach((step: any, index: number) => {
            if (step.href.indexOf(subRoute) > -1) {
                currentStepIndex = index;
            }
        });
        return currentStepIndex;
    }

    formatSteps(steps: any[], currentStepIndex: number = 1) {
        let step: any;
        return steps.map((step1: any, index: number) => {
            step = Object.assign({}, step1);
            if (!step.classes) {
                step.classes = {};
            }
            step.classes.visited = index <= currentStepIndex ? true : false;
            step.disabled = !step.classes.visited;
            return step;
        });
    }
}
