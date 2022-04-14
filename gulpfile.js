const gulp = require('gulp');
const svg_service = require('./gulp/svg_service.plugin');
const svgo = require('gulp-svgo');
const template = require('gulp-template');

const ENV_TEMPLATE_SRC = './src/environments/environment.prod.ts.template';
const ENV_TEMPLATE_DEST = '/src/environments/environment.prod.ts';

const SERVICE_TEMPLATE_SRC = './gulp/svg_service.template';
const SERVICE_TEMPLATE_DEST = './src/build/svg-inline-ng-plugin.service.ts';

function bundle_svg() {
    return gulp.src('./build/assets/svg/*.svg')
        .pipe(svgo())
        .pipe(svg_service(SERVICE_TEMPLATE_SRC, SERVICE_TEMPLATE_DEST));
}

// function build_environment() {
//     return gulp.src(ENV_TEMPLATE_SRC)
//         .pipe(template(process.env))
//         .pipe(gulp.dest(ENV_TEMPLATE_DEST));
// }

let prebuild = gulp.series(bundle_svg);

exports.prebuild = prebuild;
exports.bundle_svg = bundle_svg;
