// Unlike most files, this is NOT an angular service.

import {gql} from 'apollo-angular';


let fragments1: any = {
    productType: gql`
        fragment ProductType on ProductType {
            id
            isActive
            code
            name
        }
    `,
    providerType: gql`
        fragment ProviderType on ProviderType {
            id
            isActive
            code
            shortName
            longName
        }
    `,
    serviceType: gql`
        fragment ServiceType on ServiceType {
            id
            isActive
            code
            shortName
            longName
        }
    `,
};

fragments1.service = gql`
        fragment Service on Service {
            isActive
            code
            name
            serviceType {
                ...ServiceType
            }
            productType {
                ...ProductType
            }
            providerTypes {
                edges {
                    node {
                        ...ProviderType
                    }
                }
            }
        }
        ${fragments1.serviceType}
        ${fragments1.productType}
        ${fragments1.providerType}
    `;

export const plGQLFragments = fragments1;
