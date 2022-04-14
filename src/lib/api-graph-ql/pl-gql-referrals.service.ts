import { Injectable } from '@angular/core';

import { PLGraphQLService } from '../pl-graph-ql';

interface QueryOptions {
    includeOptionalReferralFields?: boolean;
}

@Injectable()
export class PLGQLReferralsService {
    constructor(private plGraphQL: PLGraphQLService) {}

    getById(id: string, options: QueryOptions = {}) {
        const optionalReferralFields = options.includeOptionalReferralFields ?
            `
                esy
                grade
                frequency
                interval
                isScheduled
                duration
                grouping
                isShortTerm
                language {
                    name
                    code
                }
            `
            : '';

        const variables: any = { id };

        return this.plGraphQL.query(
            `query Referral($id: ID!) {
                referral(id: $id) {
                    id
                    created
                    createdBy {
                        id
                    }
                    client {
                        id
                        firstName
                        lastName
                        locations {
                            edges {
                                node {
                                    id
                                    name
                                    parent {
                                        id
                                        name
                                    }
                                }
                            }
                        }
                    }
                    dueDate
                    providerType {
                        id
                        longName
                        code
                    }
                    productType {
                        id
                        code
                    }
                    provider {
                        id
                        firstName
                        lastName
                    }
                    state
                    bilingual
                    clientService {
                        id
                    }
                    notes
                    ${ optionalReferralFields }
                    reason
                    permissions {
                        matchProvider
                        declineReferral
                        deleteReferral
                        unmatchReferral
                        updateReferral
                    }
                    assessmentPlanSignedOn
                    meetingDate
                }
             }`,
            variables,
            {},
        );
    }
}
