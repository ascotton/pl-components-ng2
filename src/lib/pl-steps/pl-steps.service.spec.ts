import { TestBed, async } from '@angular/core/testing';

import { PLStepsService } from './pl-steps.service';

describe('PlStepsService', function() {
    beforeEach(() => {
        this.plStepsService = new PLStepsService();
    });

    it("getCurrentStep - should return the current step index in steps list", () => {
        const steps = [
            { href: '/other/step-1' },
            { href: '/other/step-2' },
        ];
        expect(this.plStepsService.getCurrentStep(steps, [], 'home/test/other')).toEqual(1);
    });

    it("getCurrentStep - should return the current step index of 0 since steps don't have subRoute", () => {
        const steps = [
            { href: '/home/step-1' },
            { href: '/home/step-2' },
        ];
        expect(this.plStepsService.getCurrentStep(steps, [], 'home/test/other')).toEqual(0);
    });

    it("getCurrentStep - should return the current step index where some steps don't have subRoute", () => {
        const steps = [
            { href: '/other/step-1' },
            { href: '/home/step-2' },
        ];
        expect(this.plStepsService.getCurrentStep(steps, [], 'home/test/other?')).toEqual(0);
    });

    it('formatSteps - should return the formatted steps of a steps list with classes', () => {
        const steps = [
            { 
                classes: { visited: false },
                disabled: true
            },
            { 
                classes: { visited: true },
                disabled: false
            }
        ];
        const steps2 = [
            { 
                classes: { visited: true },
                disabled: false
            },
            { 
                classes: { visited: false },
                disabled: true
            }
        ];
        expect(this.plStepsService.formatSteps(steps, 0)).toEqual(steps2);
    });

    it('formatSteps - should return the formatted steps of a step list with empty classes', () => {
        const steps = [
            { 
                classes: {},
                disabled: true 
            },
            { 
                classes: {},
                disabled: false
            }
        ];
        const steps2 = [
            { 
                classes: { visited: true },
                disabled: false
            },
            { 
                classes: { visited: true },
                disabled: false
            }
        ];
        expect(this.plStepsService.formatSteps(steps, 1)).toEqual(steps2);
    });

    it("formatSteps - should return the formatted steps of an empty step list", () => {
        expect(this.plStepsService.formatSteps([], 1)).toEqual([]);
    });
});
