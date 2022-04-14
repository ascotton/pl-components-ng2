import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PLGraphQLService } from '../pl-graph-ql';
import { PLLodashService } from '../pl-lodash';
import { PLGQLStringsService } from './fragments/pl-gql-strings.service';
import { PLGQLQueriesService } from './queries/pl-gql-queries.service';
import { PLApiServiceSaveService } from '../api/client-service/pl-api-service-save.service';

let plGQLClientService: any;

@Injectable()
export class PLGQLClientServiceService {
    constructor(
        private plGraphQL: PLGraphQLService,
        private plGQLStrings: PLGQLStringsService,
        private plApiServiceSave: PLApiServiceSaveService,
        private plLodash: PLLodashService,
        private plGQLQueries: PLGQLQueriesService
    ) {
        plGQLClientService = this;
    }

    save(serviceObj: any = {}, referralId: string, documents: any, clientId: string) {
        const loaded: any = {};
        return new Observable((observer: any) => {
            const afterSaveService = function(resClientService: any) {
                // GraphQL does not have file support so need to use REST.
                // Mimic REST client service structure. Will get `resFiles`
                // as a mutation on this as a resolved value.
                const clientServiceInput = {
                    uuid: resClientService.id,
                    client: clientId,
                };
                plGQLClientService.plApiServiceSave.saveDocuments(documents, clientServiceInput).subscribe(
                    (res: any) => {
                        observer.next({});
                    },
                    (err: any) => {
                        observer.error(err);
                    }
                );
            };

            let type: any = null;
            let clientService: any = null;
            if (serviceObj.evaluation) {
                type = 'evaluation';
                clientService = serviceObj.evaluation;
                this.saveEvaluation(clientService, referralId).subscribe(
                    (res: any) => {
                        afterSaveService(res.evaluation);
                    },
                    err => {
                        observer.error(err);
                    }
                );
            } else if (serviceObj.directService) {
                type = 'directService';
                clientService = serviceObj.directService;
                this.saveDirectService(clientService, referralId).subscribe(
                    (res: any) => {
                        afterSaveService(res.directService);
                    },
                    err => {
                        observer.error(err);
                    }
                );
            } else {
                observer.error({ message: 'One of serviceObj.directService or serviceObj.evaluation is required.' });
            }
        });
    }

    saveDirectService(clientService: any, referralId: string) {
        return new Observable((observer: any) => {
            let matchToSelf = clientService.matchToSelf;
            let clientServiceCopy = this.plLodash.omit(clientService, ['matchToSelf']);
            if (clientService.id) {
                this.updateDirectService(clientServiceCopy).subscribe(
                    (res: any) => {
                        observer.next(res.updateDirectService);
                    },
                    err => {
                        observer.error(err);
                    }
                );
            } else {
                clientServiceCopy.startDate = `${clientService.startDate}T00:00:00Z`;
                this.createDirectService(clientServiceCopy, referralId, matchToSelf).subscribe(
                    (res: any) => {
                        observer.next(res.createDirectService);
                    },
                    err => {
                        observer.error(err);
                    }
                );
            }
        });
    }

    createDirectService(clientService: any, referralId: string, matchToSelf: boolean) {
        const variables: any = {
            directService: clientService,
            referralId: referralId,
            matchToSelf: matchToSelf,
        };
        const moreParams = {
            refetchQueries: this.plGQLQueries.queryGroups.referralsAndServices,
        };
        return this.plGraphQL.mutate(
            `mutation createDirectService($directService:
         CreateDirectServiceInputData!, $referralId: ID, $matchToSelf: Boolean) {
            createDirectService(input: { directService: $directService, referralId: $referralId, matchToSelf: $matchToSelf }) {
                errors {
                    code
                    field
                    message
                }
                status
                directService {
                    ${this.plGQLStrings.directServiceFull}
                }
            }
        }`,
            variables,
            { debug: true },
            moreParams
        );
    }

    updateDirectService(clientService: any) {
        const variables: any = {
            directService: this.plLodash.omit(clientService, ['clientId']),
        };
        const moreParams = {
            refetchQueries: this.plGQLQueries.queryGroups.referralsAndServices,
        };
        return this.plGraphQL.mutate(
            `mutation updateDirectService($directService:
         UpdateDirectServiceInputData) {
            updateDirectService(input: { directService: $directService }) {
                errors {
                    code
                    field
                    message
                }
                status
                directService {
                    ${this.plGQLStrings.directServiceFull}
                }
            }
        }`,
            variables,
            { debug: true },
            moreParams
        );
    }

    saveEvaluation(clientService: any, referralId: string) {
        return new Observable((observer: any) => {
            let matchToSelf = clientService.matchToSelf;
            let clientServiceCopy = this.plLodash.omit(clientService, ['matchToSelf']);
            if (clientService.id) {
                this.updateEvaluation(clientServiceCopy).subscribe(
                    (res: any) => {
                        observer.next(res.updateEvaluation);
                    },
                    err => {
                        observer.error(err);
                    }
                );
            } else {
                this.createEvaluation(clientServiceCopy, referralId, matchToSelf).subscribe(
                    (res: any) => {
                        observer.next(res.createEvaluation);
                    },
                    err => {
                        observer.error(err);
                    }
                );
            }
        });
    }

    createEvaluation(clientService: any, referralId: string, matchToSelf: boolean) {
        const variables: any = {
            evaluation: clientService,
            referralId: referralId,
            matchToSelf: matchToSelf,
        };
        const moreParams = {
            refetchQueries: this.plGQLQueries.queryGroups.referralsAndServices,
        };
        return this.plGraphQL.mutate(
            `mutation createEvaluation($evaluation:
         CreateEvaluationInputData!, $referralId: ID, $matchToSelf: Boolean) {
            createEvaluation(input: { evaluation: $evaluation, referralId: $referralId, matchToSelf: $matchToSelf }) {
                errors {
                    code
                    field
                    message
                }
                status
                evaluation {
                    ${this.plGQLStrings.evaluationFull}
                }
            }
        }`,
            variables,
            { debug: true },
            moreParams
        );
    }

    updateEvaluation(clientService: any) {
        if (clientService.dueDate && clientService.dueDate.length <= 10) {
            clientService.dueDate = `${clientService.dueDate}T00:00:00`;
        }
        const variables: any = {
            evaluation: this.plLodash.omit(clientService, ['clientId']),
        };
        const moreParams = {
            refetchQueries: this.plGQLQueries.queryGroups.referralsAndServices,
        };
        return this.plGraphQL.mutate(
            `mutation updateEvaluation($evaluation:
         UpdateEvaluationInputData) {
            updateEvaluation(input: { evaluation: $evaluation }) {
                errors {
                    code
                    field
                    message
                }
                status
                evaluation {
                    ${this.plGQLStrings.evaluationFull}
                }
            }
        }`,
            variables,
            { debug: true },
            moreParams
        );
    }
}
