module.exports = {
    cookieDomain: 'localhost',
    heapKey: '',
    sentryKey: '',
    testDataCacheType: 'file',
    apps: {
        apollo: {
            url: process.env.APOLLO_URL || 'https://workplace.presencetest.com/graphql/v1/',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'http://localhost:4200',
        },
    },
};