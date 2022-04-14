# pl-components-ng2

## Setup / Running

### Environments

To allow dynamic configs that support environment variables, we default to configs,
 but environment variables override.
See: https://medium.com/@natchiketa/angular-cli-and-os-environment-variables-4cfa3b849659

Configs live in `config/env` and the script is in `node-scripts/set-env.js`.

- `npm run env-local` to set up the local environment.
- `npm run env-stag` or `npm run env-live` for stag and live environments.

You MUST run one of the above commands first as all future commands depend on the generate environment file.

- `npm install`
- `npm start`
- open browser to `http://localhost:4200`
- (prod) build for deploy: `npm run build`
    - test deploy: `npm run env-stag && npm run build-stag`
    - live deploy: `npm run env-live && npm run build-live`

### Tests (Unit)

`npm test`

### Tests (Cypress)

- For GUI (locally)
    - for localhost currently webpack dev server does not work - get a 404.
     So use `npm run build` then `node node-server-webpack.js` first.
    - `cypress open` then use the GUI to run tests.
- Headless (CI)
    - `cypress run --env ENVKEY=test`

## Usage

- Some modules take configuration, so must be set up by calling:
    - `this.plUrls.setUrlsDefaults(urls);` and then `this.plUrls.formUrls();`
    - `this.plHttpError.setMessages(messages);`


## Common Tasks

- Add new svg
    - Optimize it first
        - https://jakearchibald.github.io/svgomg/
        - Add proper closing tags, e.g. `<path>...</path>` instead of just `<path ... />`
        - Remove any fixed widths, heights, id's or fills. SVG should fill full box and be centered.
    - Just add the new svg to the `build/assets/svg` folder
- Run `npm run svg`, then the `src/build/svg-inline-ng-plugin.service.ts` file will include your new svg


## Dependency Notes

- Deliberately not upgraded to current:
    - typescript (Angular requires <3.6.0)
