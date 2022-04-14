import { PLMayService } from './pl-may.service';

describe('PLMayService', () => {
    const service = new PLMayService();

    const itBehavesLikeUIFlagsPermission = (fnName: string, permission: string) => {
        const permissionFn = (service[fnName]);

        it('is false if user is null', () => {
            expect(permissionFn(null)).toBeFalsy();
        });

        it('is false if xEnabledUiFlags property is missing', () => {
            expect(permissionFn({})).toBeFalsy();
        });

        it('is true when permission is included in xEnabledUiFlags', () => {
            expect(permissionFn({ xEnabledUiFlags: [permission] })).toBeTruthy();
        });

        it('is false when permission is not included in xEnabledUiFlags', () => {
            expect(permissionFn({ xEnabledUiFlags: ['not' + permission] })).toBeFalsy();
        });
    };

    describe('observeRoomSession', () => {
        itBehavesLikeUIFlagsPermission('observeRoomSession', 'room-observe-session');
    });

    describe('viewRoomURL', () => {
        itBehavesLikeUIFlagsPermission('viewRoomURL', 'room-view-room-url');
    });

    describe('viewSchedule', () => {
        it('is false if provider is null', () => {
            expect(service.viewSchedule(null)).toBeFalsy();
        });

        it('is false if provider lacks user', () => {
            expect(service.viewSchedule({})).toBeFalsy();
        });

        it('is false if provider lacks permissions', () => {
            expect(service.viewSchedule({ user: {} })).toBeFalsy();
        });

        it('is false if provider lacks viewSchedule permission', () => {
            expect(service.viewSchedule({ user: { permissions: { viewSchedule: false } } })).toBeFalsy();
        });

        it('is true if provider has viewSchedule permission', () => {
            expect(service.viewSchedule({ user: { permissions: { viewSchedule: true } } })).toBeTruthy();
        });
    });

    describe('changeActiveStatus', () => {
        it('is true if user roles includes customer-basic', () => {
            expect(service.changeActiveStatus(['customer-basic'])).toBeTruthy();
        });

        it('is true if user groups includes customer-admin', () => {
            expect(service.changeActiveStatus(['customer-admin'])).toBeTruthy();
        });

        it('is true if user roles includes both customer-basic and customer-admin', () => {
            expect(service.changeActiveStatus(['customer-basic', 'customer-admin'])).toBeTruthy();
        });

        it('is false if user roles includes something other than customers', () => {
            expect(service.changeActiveStatus(['customer-admin', 'Provider'])).toBeFalsy();
        });

        it('is false if there are no roles', () => {
            expect(service.changeActiveStatus([])).toBeFalsy();
        });
    });
});
