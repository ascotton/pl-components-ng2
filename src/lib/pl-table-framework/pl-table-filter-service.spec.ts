import { mock, instance } from 'ts-mockito';

import { PLTableFrameworkService } from './pl-table-framework.service';
import { PLTableFiltersService } from './pl-table-filters.service';
import { PLTableFilter, plTableFilterMock } from './pl-table-filter';

describe('PLTableFilterService', () => {
    const service = new PLTableFiltersService(instance(mock(PLTableFrameworkService)));

    describe('inferredFilterType', () => {
        it('returns type property if not empty', () => {
            const filter = plTableFilterMock({ type: 'a type' });
            expect(service.inferredFilterType(filter)).toBe('a type');
        });

        it('matches select', () => {
            const filter = plTableFilterMock({ selectOpts: [] });
            expect(service.inferredFilterType(filter)).toBe('select');
        });

        it('matches multieSelect', () => {
            const filter = plTableFilterMock({ selectOptsMulti: [] });
            expect(service.inferredFilterType(filter)).toBe('multiSelect');
        });

        it('matches checkbox', () => {
            const filter = plTableFilterMock({ selectOptsCheckbox: [] });
            expect(service.inferredFilterType(filter)).toBe('checkbox');
        });

        it('matches selectApi', () => {
            const filter = plTableFilterMock({ selectOptsApi: [] });
            expect(service.inferredFilterType(filter)).toBe('selectApi');
        });

        it('matches multiSelectApi', () => {
            const filter = plTableFilterMock({ selectOptsMultiApi: [] });
            expect(service.inferredFilterType(filter)).toBe('multiSelectApi');
        });

        it('is text when nothing else matches', () => {
            const filter = plTableFilterMock();
            expect(service.inferredFilterType(filter)).toBe('text');
        });
    });
});
