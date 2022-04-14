import { of } from 'rxjs';
import {
    anyString,
    anything,
    capture,
    mock,
    instance,
    when,
} from 'ts-mockito';

import { PLGraphQLService } from '../pl-graph-ql';
import { PLGQLReferralsService } from './pl-gql-referrals.service';

describe('PLGQLReferralsService', () => {
    const gql = mock(PLGraphQLService);
    let service: PLGQLReferralsService;

    beforeEach(() => {
        service = new PLGQLReferralsService(instance(gql));

        when(gql.query(anyString(), anything(), anything())).thenReturn(of({}));
    });

    describe('getById', () => {
        const extraReferralFields = [
            'esy',
            'grade',
            'frequency',
            'interval',
            'duration',
            'grouping',
        ];

        it('should not include extra referral fields by default', (done) => {
            service.getById('42').subscribe({
                next: () => {
                    const [queryString] = capture(gql.query).last();

                    extraReferralFields.forEach(field => expect(queryString).not.toContain(field));

                    done();
                },
            });
        });

        it('should include extra referral fields if option set', (done) => {
            service.getById('42', { includeOptionalReferralFields: true }).subscribe({
                next: () => {
                    const [queryString] = capture(gql.query).last();

                    extraReferralFields.forEach(field => expect(queryString).toContain(field));

                    done();
                },
            });
        });
    });
});
