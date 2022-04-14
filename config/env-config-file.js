const envConfigFile = {};

envConfigFile.getFileString = (isProd, envConfig, envKey, gitSha) => {
    return `
    export const environment = {
        env_key: "${envKey}",
        production: ${isProd},
        app_name: "${(process.env.APP_NAME || 'pl-components-ng2')}",
        cookie_domain: "${(process.env.COOKIE_DOMAIN || envConfig.cookieDomain)}",
        heap_key: "${(process.env.HEAP_KEY || envConfig.heapKey)}",
        sentry_key: "${(process.env.SENTRY_KEY || envConfig.sentryKey)}",
        git_sha: "${gitSha}",
        apps: ${JSON.stringify((process.env.APPS || envConfig.apps), null, 4)},
    };
    `;
};

module.exports = envConfigFile;