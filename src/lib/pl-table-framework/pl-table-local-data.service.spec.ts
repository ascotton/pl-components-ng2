import { TestBed, async } from '@angular/core/testing';

import { PLTableLocalDataService } from './pl-table-local-data.service';

    const testData = [
        {first: 'Luke', last: 'Skywalker'},
        {first: 'Leia', last: 'Organa'},
        {first: 'Obi-wan', last: 'Kenobi'},
        {first: 'Han', last: 'Solo'},
    ];

describe('PLTableFrameworkService', function() {
    beforeEach(() => {
        this.plTableLocalData = new PLTableLocalDataService();
        this.plTableLocalData.dataRows = testData;
    });

    it('updateQueryFromParams - should update the page size and currentPage', () => {
        const query = {
            data: {
                pageSize: 25,
                currentPage: 2
            }
        };
        this.plTableLocalData.onQuery(query);
        expect(this.plTableLocalData.pageSize).toEqual(25);
        expect(this.plTableLocalData.currentPage).toEqual(2);
    });

    it('updateQueryFromParams - it should sort data', () => {
        const query = {
            data: {},
            orderQuery: '-first',
        };
        this.plTableLocalData.onQuery(query);
        expect(this.plTableLocalData.displayRows[0].first).toEqual('Han');
        expect(this.plTableLocalData.displayRows[3].first).toEqual('Obi-wan');
    });

    it('updateQueryFromParams - it should reverse sort data', () => {
        const query = {
            data: {},
            orderQuery: 'first',
        };
        this.plTableLocalData.onQuery(query);
        expect(this.plTableLocalData.displayRows[0].first).toEqual('Obi-wan');
        expect(this.plTableLocalData.displayRows[3].first).toEqual('Han');
    });

    it('updateQueryFromParams - it should paginate data', () => {
        const query = {
            data: {
                pageSize: 2,
            }
        };
        this.plTableLocalData.onQuery(query);
        expect(this.plTableLocalData.displayRows.length).toEqual(2);
    });

    it('updateQueryFromParams - it should page data', () => {
        const query = {
            data: {
                pageSize: 2,
            },
            orderQuery: '-first',
        };
        this.plTableLocalData.onQuery(query);
        expect(this.plTableLocalData.displayRows[1].first).toEqual('Leia');

        const query2 = {
            data: {
                currentPage: 2,
            },
        };
        this.plTableLocalData.onQuery(query2);
        expect(this.plTableLocalData.displayRows[1].first).toEqual('Obi-wan');
    });

});
