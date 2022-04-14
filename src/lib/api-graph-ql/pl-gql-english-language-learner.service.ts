import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { PLGraphQLService } from '../pl-graph-ql';

@Injectable()
export class PLGQLEnglishLanguageLearnerService {
    private englishEnglishLanguageLearnerLearner: any[] = [];

    constructor(
        // private plGraphQL: PLGraphQLService
    ) {}

    // Note: currently this is just hardcoded and could just return synchronously.
    // To future proof the interface, we wrap it in an observable so we can pull from the backend
    // later.
    get(options1: any = {}) {
        return new Observable((observer: any) => {
            this.englishEnglishLanguageLearnerLearner = [
                { code: 'NEVER_IDENTIFIED', name: 'Never Identified as ELL' },
                { code: 'CURRENTLY_IDENTIFIED', name: 'Currently Identified as ELL' },
                { code: 'PREVIOUSLY_IDENTIFIED', name: 'Previously Identified as ELL' },
            ];
            observer.next(this.englishEnglishLanguageLearnerLearner);
        });
    }

    formOpts(englishEnglishLanguageLearnerLearner1: any = null) {
        const englishEnglishLanguageLearnerLearner =
            englishEnglishLanguageLearnerLearner1 || this.englishEnglishLanguageLearnerLearner;
        if (englishEnglishLanguageLearnerLearner && englishEnglishLanguageLearnerLearner.length) {
            return englishEnglishLanguageLearnerLearner.map((item: any) => {
                return { value: item.code, label: item.name };
            });
        }
        return [];
    }
}
