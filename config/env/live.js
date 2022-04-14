module.exports = {
    cookieDomain: 'presencelearning.com',
    heapKey: '',
    sentryKey: '',
    testDataCacheType: 'file',
    apps: {
        apollo: {
            url: process.env.APOLLO_URL || 'https://workplace.presencelearning.com/graphql/v1/',
        },
        components: {
            url: process.env.COMPONENTS_URL || 'https://apps.presencelearning.com/components'
        },
    },
};