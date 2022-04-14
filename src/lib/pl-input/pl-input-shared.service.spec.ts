import { PLInputSharedService } from './pl-input-shared.service';
import { PLInputErrorsService } from './pl-input-errors.service';

describe('PLInputSharedService', () => {
    const inputErrorsServiceStub: any = {};
    const service: PLInputSharedService = new PLInputSharedService(<PLInputErrorsService>inputErrorsServiceStub)

    describe('containsFocus', () => {
        const nodeStub = () => { return { contains: () => false } };
        const containerEl = nodeStub();

        it('is true when element is active element', () => {
            expect(service.containsFocus(containerEl, containerEl)).toBeTruthy();
        });

        it('is false when active element is not descendent of element', () => {
            spyOn(containerEl, 'contains').and.returnValue(false);

            expect(service.containsFocus(containerEl, nodeStub())).toBeFalsy();
        });

        it('is true when active element is descendent of element', () => {
            spyOn(containerEl, 'contains').and.returnValue(true);

            expect(service.containsFocus(containerEl, nodeStub())).toBeTruthy();
        });

        it('is false when active element is null', () => {
            expect(service.containsFocus(containerEl, null)).toBeFalsy();
        });
    })
});
