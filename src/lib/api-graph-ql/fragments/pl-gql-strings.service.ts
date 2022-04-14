import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PLGQLStringsService {
    // Base, independent strings.
    address = `
        street
        city
        postalCode
        state
        country
    `;
    clientEvalDates = `
        activeIep {
            id
            status
            startDate
            nextAnnualIepDate
            nextEvaluationDate
            prevEvaluationDate
        }
    `;
    directService = `
        id
        startDate
        endDate
        duration
        frequency
        interval
        startingBalance
        totalMinutesRequired
        minutesReceived
        minutesRemaining
    `;
    language = `
        id
        code
        name
    `;
    locationsWithParent = `
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
    `;
    productType = `
        id
        isActive
        code
        name
    `;
    providerType = `
        id
        isActive
        code
        shortName
        longName
    `;
    referralPermissions = `
        matchProvider
        declineReferral
        deleteReferral
        unmatchReferral
        updateReferral
    `;
    serviceType = `
        id
        isActive
        code
        shortName
        longName
    `;
    userName = `
        firstName
        lastName
    `;

    // Dependent strings
    areasOfConcern = `
        edges {
            node {
                id
                isActive
                name
                serviceType {
                    ${this.serviceType}
                }
            }
        }
    `;
    assessmentsUsed = `
        edges {
            node {
                id
                isActive
                shortName
                longName
            }
        }
    `;
    clientLanguages = `
        primaryLanguage {
            ${this.language}
        }
        secondaryLanguage {
            ${this.language}
        }
        englishLanguageLearnerStatus
    `;
    clientName = `
        ${this.userName}
    `;
    createdBy = `
        id
        ${this.userName}
    `;
    evaluation = `
        id
        evaluationType
        status
        statusDisplay
        referringProvider {
            id
            ${this.userName}
        }
        assignedTo {
            id
            ${this.userName}
        }
        assignedDate
        dueDate
        completedDate
        consentSigned
        areasOfConcern {
            ${this.areasOfConcern}
        }
        assessmentsUsed {
            ${this.assessmentsUsed}
        }
        celdtListening
        celdtSpeaking
        celdtReading
        celdtWriting
        celdtComprehension
    `;
    providerProfile = `
        id
        user {
            id
            username
            ${this.userName}
            permissions {
                manageCaseload
                viewSchedule
            }
        }
        providerTypes {
            edges {
                node {
                    ${this.providerType}
                }
            }
        }
        primaryLanguage {
            ${this.language}
        }
        secondaryLanguage {
            ${this.language}
        }
        timezone
        caseloadCount
        phone
        email
        billingAddress {
            ${this.address}
        }
    `;
    service = `
        id
        isActive
        code
        name
        serviceType {
            ${this.serviceType}
        }
        productType {
            ${this.productType}
        }
        providerTypes {
            edges {
                node {
                    ${this.providerType}
                }
            }
        }
    `;

    directServiceFull = `
        id
        isActive
        created
        createdBy {
            ${this.createdBy}
        }
        client {
            id
            ${this.clientName}
            ${this.clientLanguages}
            ${this.clientEvalDates}
        }
        service {
            ${this.service}
        }
        status
        statusDisplay
        ${this.directService}
    `;
    evaluationFull = `
        id
        isActive
        created
        createdBy {
            ${this.createdBy}
        }
        client {
            id
            ${this.clientName}
            ${this.clientLanguages}
            ${this.clientEvalDates}
        }
        bilingual
        service {
            ${this.service}
        }
        ${this.evaluation}
    `;
    referralFull = `
        id
        created
        createdBy {
            ${this.createdBy}
        }
        client {
            id
            ${this.clientName}
            locations {
                ${this.locationsWithParent}
            }
        }
        providerType {
            ${this.providerType}
        }
        productType {
            ${this.productType}
        }
        provider {
            id
            ${this.userName}
        }
        state
        bilingual
        clientService {
            id
        }
        notes
        reason
        permissions {
            ${this.referralPermissions}
        }
    `;
}
