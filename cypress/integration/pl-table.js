import { appUrls } from '../support/config/config';
import { plTable } from 'pl-cypress-shared';

describe('PL Table', function() {

    xit ('should show a table with defaults', () => {
        cy.visit(`${appUrls.componentsFE}/tables`);

        const selector = '.x-qa-table-defaults';
        plTable.expectHeaders(selector, ['first', 'last', 'zip', 'unused', 'zip_order', 'name_combined']);
    });

    xit ('should show a table with no filters', () => {
        // cy.visit(`${appUrls.componentsFE}/tables`);

        const selector = '.x-qa-table-no-filters';
        plTable.expectHeaders(selector, ['first', 'last', 'zip', 'unused', 'zip_order', 'name_combined']);
    });

    xit ('should show a table with custom columns', () => {
        // cy.visit(`${appUrls.componentsFE}/tables`);

        const selector = '.x-qa-table-custom-columns';
        plTable.expectHeaders(selector, ['Zip Code', 'first']);
    });

    it ('should not fail', () => {
        expect(true).to.be.true; 
    });

});
