import { PLClientStudentDisplayService } from './pl-client-student-display.service';

describe('PLClientStudentDisplayService', () => {
    describe('get', () => {
        it('returns lower case client as default', () => {
            let user = {};
            let text = PLClientStudentDisplayService.get(user);
            expect(text).toBe('client');

            user = {
                xEnabledUiFlags: ['some-other-flag'],
            };
            text = PLClientStudentDisplayService.get(user);
            expect(text).toBe('client');
        });

        it('returns student if flag is set', () => {
            const user = {
                xEnabledUiFlags: ['some-other-flag', 'display-client-as-student'],
            };
            const text = PLClientStudentDisplayService.get(user);
            expect(text).toBe('student');
        });

        it('should capitalize', () => {
            const user = {};
            const options: any = { capitalize: true };
            const text = PLClientStudentDisplayService.get(user, options);
            expect(text).toBe('Client');
        });

        it('should uppercase', () => {
            const user = {
                xEnabledUiFlags: ['display-client-as-student'],
            };
            const options: any = { uppercase: true };
            const text = PLClientStudentDisplayService.get(user, options);
            expect(text).toBe('STUDENT');
        });
    });
});