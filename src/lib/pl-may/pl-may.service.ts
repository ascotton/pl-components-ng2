import { Injectable } from '@angular/core';

@Injectable()
export class PLMayService {

    public static UI_FLAGS_CUSTOMER_DASHBOARD = 'customer-dashboard';
    public static UI_FLAGS_PROVIDER_DASHBOARD = 'provider-dashboard';
    public static ENABLED_FEATURES_NEW_LANDING = 'new-landing';
    public static ENABLED_FEATURES_VALIDATE_SERVICE_TIMES = 'validate-service-times';

    constructor() { }

    isSuperuser(user: any) {
        return user.is_superuser;
    }

    isNotSuperuser(user: any) {
        return !this.isSuperuser(user);
    }

    private userInGroup(user: any, groupName: string) {
        if (!user || !user.groups) {
            return false;
        }
        return user.groups.indexOf(groupName) > -1;
    }

    private userNotInGroups(user: any, groupNames: string[]): boolean {
        if (!user || !user.groups) {
            return false;
        }
        return !groupNames
            .map(groupName => user.groups.includes(groupName))
            .find(T => T);
    }

    isAdminType(user: any) {
        return this.isAdmin(user) || this.isSupport(user) || this.isAccountManager(user) ? true : false;
    }

    isAdmin(user: any) {
        return this.userInGroup(user, 'Administrator');
    }

    isNotAdmin(user: any) {
        return !this.isAdmin(user);
    }

    isSupport(user: any) {
        return this.userInGroup(user, 'Service & Support');
    }

    isAccountManager(user: any) {
        return this.userInGroup(user, 'Account Managers') || this.userInGroup(user, 'Account Manager');
    }

    isClinicalAccountManager(user: any): boolean {
        return this.userInGroup(user, 'Clinical Account Manager');
    }

    isLead(user: any) {
        return this.userInGroup(user, 'LeadClinician');
    }

    isProvider(user: any) {
        return this.userInGroup(user, 'Provider');
    }

    isCustomer(user: any): boolean {
        return this.isCustomerBasic(user) || this.isCustomerAdmin(user);
    }

    isCustomerAdmin(user: any): boolean {
        return this.userInGroup(user, 'CustomerAdmin');
    }

    isCustomerBasic(user: any): boolean {
        return this.userInGroup(user, 'CustomerBasic');
    }

    getEnabledFeatures(user: any): any {
        const features = user.xEnabledFeatures;

        return {
            isNewLandingEnabled: features.includes(PLMayService.ENABLED_FEATURES_NEW_LANDING),
            validateServiceTimes: features.includes(PLMayService.ENABLED_FEATURES_VALIDATE_SERVICE_TIMES),
        };
    }

    getDashboardUIFlags(user: any): any {
        const isCustomerDashboardEnabled = user.xEnabledUiFlags.find((_: any) => _ === PLMayService.UI_FLAGS_CUSTOMER_DASHBOARD);
        const isProviderDashboardEnabled = user.xEnabledUiFlags.find((_: any) => _ === PLMayService.UI_FLAGS_PROVIDER_DASHBOARD);

        return {
            isCustomerDashboardEnabled,
            isProviderDashboardEnabled,
        }
    }

    // If true, then frequency, interval, and duration fields are required when
    // converting a referral to a service
    isValidatingServiceTimes(user: any): boolean {
        return this.getEnabledFeatures(user).validateServiceTimes;
    }

    // checks a feature switch
    isNewLandingEnabled(user: any): boolean {
        const enabledFeatures = this.getEnabledFeatures(user);
        return enabledFeatures.isNewLandingEnabled;
    }

    // checks if at least one user UI flag is set
    isNewLandingAccessEnabled(user: any): boolean {
        return this.canAccessCustomerDashboard(user) || this.canAccessProviderLanding(user);
    }

    canAccessCustomerDashboard(user: any): boolean {
        return !!this.getDashboardUIFlags(user).isCustomerDashboardEnabled;
    }

    canAccessProviderLanding(user: any): boolean {
        return !!this.getDashboardUIFlags(user).isProviderDashboardEnabled;
    }

    canGlobalSearch(user: any) {
        // , 'LeadClinician'
        return this.isProvider(user) &&
            this.userNotInGroups(user, ['Service & Support', 'Account Manager', 'Account Managers']);
    }

    createUser(currentUser: { xAuthPermissions?: string[] }): boolean {
        return currentUser && currentUser.xAuthPermissions && currentUser.xAuthPermissions.includes('user.add_user');
    }

    editUser(currentUser: { xAuthPermissions?: string[] }): boolean {
        return currentUser && currentUser.xAuthPermissions && currentUser.xAuthPermissions.includes('user.change_user');
    }

    manageAssignments(currentUser: { xAuthPermissions?: string[] }): boolean {
        return currentUser
            && currentUser.xAuthPermissions
            && currentUser.xAuthPermissions.includes('assignment.manage_account');
    }

    changeActiveStatus(userRoles: string[]): boolean {
        const customerRoles = ['customer-admin', 'customer-basic'];

        return userRoles.length > 0 && userRoles.every(g => customerRoles.includes(g));
    }

    getUserProviderTypes(user: any) {
        if (user.xProvider && user.xProvider.provider_types) {
            return user.xProvider.provider_types;
        }
        return [];
    }

    userHasServiceProviderTypes(user: any, serviceProviderTypes: any[]) {
        const userProviderTypes = this.getUserProviderTypes(user);
        if (userProviderTypes.length) {
            for (let uu = 0; uu < userProviderTypes.length; uu++) {
                let userProviderTypeUuid = userProviderTypes[uu];
                for (let ss = 0; ss < serviceProviderTypes.length; ss++) {
                    let serviceProviderType = serviceProviderTypes[ss];
                    if ((serviceProviderType.uuid || serviceProviderType.id) === userProviderTypeUuid) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    createDirectService(user: any) {
        return this.isNotAdmin(user) && this.isNotSuperuser(user) ? true : false;
    }

    selfReferService(user: any) {
        return this.isNotAdmin(user) && this.isNotSuperuser(user) ? true : false;
    }

    addService(user: any) {
        return this.isSuperuser(user) ||
            (user.xGlobalPermissions && user.xGlobalPermissions.addEvaluation && user.xGlobalPermissions.addDirectService)
            ? true
            : false;
    }

    // serviceCategory is either `evaluation` or `direct_service`.
    // editService(user: any, serviceProviderTypes: any[], serviceCategory: string = '',
    //  assignedToUuid: string = '') {
    //     if (this.isSuperuser(user)) {
    //         return true;
    //     }
    //     if (this.isProvider(user)) {
    //         // See if have matching provider type.
    //         if (this.userHasServiceProviderTypes(user, serviceProviderTypes)) {
    //             // If eval, see if it's a self referral.
    //             if (serviceCategory !== 'evaluation') {
    //                 return true;
    //             } else if (assignedToUuid === user.uuid) {
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    // Now edit service is just change phi on the client.
    editService(user: any, client: any) {
        return this.changePhiClient(user, client);
    }

    // addMetrics(user: any, serviceProviderTypes: any[], serviceCategory: string = '',
    //  assignedToUuid: string = '') {
    //     return this.editService(user, serviceProviderTypes, serviceCategory, assignedToUuid);
    // }

    // editMetrics(user: any, serviceProviderTypes: any[], serviceCategory: string = '',
    //  assignedToUuid: string = '') {
    //     return this.editService(user, serviceProviderTypes, serviceCategory, assignedToUuid);
    // }

    // addNoms(user: any, serviceProviderTypes: any[], serviceCategory: string = '',
    //  assignedToUuid: string = '') {
    //     return this.editService(user, serviceProviderTypes, serviceCategory, assignedToUuid);
    // }

    // editNoms(user: any, serviceProviderTypes: any[], serviceCategory: string = '',
    //  assignedToUuid: string = '') {
    //     return this.editService(user, serviceProviderTypes, serviceCategory, assignedToUuid);
    // }

    observeRoomSession(user: { xEnabledUiFlags?: string[] }): boolean {
        return user && user.xEnabledUiFlags && user.xEnabledUiFlags.includes('room-observe-session');
    }

    viewRoomURL(user: { xEnabledUiFlags?: string[] }): boolean {
        return user && user.xEnabledUiFlags && user.xEnabledUiFlags.includes('room-view-room-url');
    }

    viewSchedule(provider: any): boolean {
        return provider && provider.user && provider.user.permissions && provider.user.permissions.viewSchedule;
    }

    generateNewRoom(user: any) {
        return !!(this.isSuperuser(user));
    }

    resetRoomWhiteboard(user: any) {
        return !!(this.isSupport(user) || this.isSuperuser(user));
    }

    addContact(user: any, client: any) {
        return this.changePiiClient(user, client);
    }

    editContact(user: any, client: any) {
        return this.changePiiClient(user, client);
    }

    removeClientFromCaseload(user: any, clientByUser: any) {
        if (this.isProvider(user) && clientByUser.inCaseload) {
            return true;
        }
        return false;
    }
    addClientToCaseload(user: any, clientByUser: any) {
        if (this.isProvider(user) && !clientByUser.inCaseload) {
            return true;
        }
        return false;
    }

    editClient(user: any, client: any) {
        return this.changePiiClient(user, client);
    }

    checkPermissionsKeys(obj: any, keys: string[]) {
        if (obj.permissions) {
            for (let ii = 0; ii < keys.length; ii++) {
                if (obj.permissions[keys[ii]]) {
                    return obj.permissions[keys[ii]];
                }
            }
        }
        return false;
    }

    viewPhiObj(obj: any) {
        return this.checkPermissionsKeys(obj, ['view_phi', 'viewPhi']);
    }

    changePhiObj(obj: any) {
        return this.checkPermissionsKeys(obj, ['change_phi', 'updatePhi']);
    }

    viewPiiObj(obj: any) {
        return this.checkPermissionsKeys(obj, ['view_pii', 'viewPii']);
    }

    changePiiObj(obj: any) {
        return this.checkPermissionsKeys(obj, ['change_pii', 'updatePii']);
    }

    viewPhiClient(user: any, client: any) {
        return this.viewPhiObj(client);
    }

    changePhiClient(user: any, client: any) {
        return this.changePhiObj(client);
    }

    viewPiiClient(user: any, client: any) {
        return this.viewPiiObj(client);
    }

    changePiiClient(user: any, client: any) {
        return this.changePiiObj(client);
    }

    uploadDocumentClient(user: any, client: any) {
        return this.checkPermissionsKeys(client, ['uploadDocument']);
    }

    viewPhiLocation(user: any, location: any) {
        return this.viewPhiObj(location);
    }

    changePhiLocation(user: any, location: any) {
        return this.changePhiObj(location);
    }

    viewPiiLocation(user: any, location: any) {
        return this.viewPiiObj(location);
    }

    changePiiLocation(user: any, location: any) {
        return this.changePiiObj(location);
    }

    exportLocationNotes(user: any): boolean {
        return user.xGlobalPermissions && user.xGlobalPermissions.exportNotes;
    }

    addReferrals(user: any) {
        return user.xGlobalPermissions && user.xGlobalPermissions.addReferrals;
    }

    addSingleReferral(user: any) {
        return user.xGlobalPermissions && user.xGlobalPermissions.addReferral;
    }

    deleteClientDocuments(user: any) {
        return this.isSuperuser(user) || this.isAdminType(user) || this.isLead(user) || this.isProvider(user);
    }

    uploadClientDocuments(user: any, client: any): boolean {
        return this.changePiiClient(user, client) || this.uploadDocumentClient(user, client);
    }

    assumeLogin(user: any): boolean {
        return !!(user.xAuthPermissions && user.xAuthPermissions.includes('user.assume'));
    }
}
