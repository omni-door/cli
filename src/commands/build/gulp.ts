export default function (config: {
  srcDir: string;
  outDir: string;
  esmDir: string;
  configurationPath?: string;
  configFileName?: string;
  pkjFieldName?: string;
}) {
  const { srcDir = 'src', outDir = 'lib', esmDir = 'es', configurationPath, pkjFieldName = 'omni', configFileName = 'omni.config.js' } = config;

  return `'use strict';

const path = require('path');
const { requireCwd } = require('@omni-door/utils');
const gulp = requireCwd('gulp');
const babel = requireCwd('gulp-babel');
const less = requireCwd('gulp-less', true);
const sass = requireCwd('gulp-sass', true)(requireCwd('sass', true));
const gulpif = requireCwd('gulp-if');
const alias = requireCwd('gulp-ts-alias');
const typescript = requireCwd('gulp-typescript');
const sourcemaps = requireCwd('gulp-sourcemaps');
const autoprefixer = requireCwd('gulp-autoprefixer');
const cssnano = requireCwd('gulp-cssnano');
const concat = requireCwd('gulp-concat');
const concatCss = requireCwd('gulp-concat-css');
const cleanCSS = requireCwd('gulp-clean-css');
const through2 = requireCwd('through2');
const replace = requireCwd('gulp-replace-path', true);
const vueSFC = requireCwd('@omni-door/gulp-plugin-vue-sfc', true);

const ppkj = requireCwd('./package.json');
const configFilePath = (ppkj && ppkj.${pkjFieldName} && ppkj.${pkjFieldName}.filePath) || './${configFileName}';
const configs = requireCwd(configFilePath);
${configurationPath ? `const customConfig = require('${configurationPath}')
` : ''}
const { build } = configs || {};
const { configuration = ({ task }) => { const [compileCJS, compileES, compileSFC, ...rest] = task; return [gulp.series(compileCJS, compileES, compileSFC), ...rest]; } } = build || {};
const project = typescript && typescript.createProject('tsconfig.json');

const params = {
  dest: {
    lib: '${outDir}',
    es: '${esmDir}'
  },
  styles: [
    '${srcDir}/**/*.{css,less,scss,sass}',
    '!${srcDir}/**/{demo,__demo__,test,__test__,stories,__stories__}/*.{css,less,scss,sass}'
  ],
  scripts: [
    '${srcDir}/**/*.{ts,tsx,js,jsx}',
    '!${srcDir}/**/{demo,__demo__,test,__test__,stories,__stories__}/*.{ts,tsx,js,jsx}'
  ],
  vue: [
    '${srcDir}/**/*.vue',
    '!${srcDir}/**/{demo,__demo__,test,__test__,stories,__stories__}/*.vue'
  ]
};

function cssInjection (content) {
  return content
    .replace(/\\\/style\\\/?'/g, "/style/css\'")
    .replace(/\\\/style\\\/?"/g, '/style/css\"')
    .replace(/\\\.(less|scss|sass)/g, '.css');
}

function compileScripts (babelEnv, destDir) {
  const { scripts } = params;
  process.env.BABEL_ENV = babelEnv;
  return gulp
    .src(scripts)
    .pipe((alias && project) ? alias({ configuration: project.config }) : through2.obj())
    .pipe(sourcemaps ? sourcemaps.init() : through2.obj())
    .pipe(project ? project() : through2.obj())
    .pipe(babel({ root: process.cwd() }))
    .pipe(replace ? replace(/\.vue("|'){1}/g, '.js$1') : through2.obj())
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\\\/|\\\\\)style(\\\/|\\\\\)index\\\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(cssInjection(content));
          file.path = file.path.replace(/index\\\.js/, 'css.js');
          this.push(file);
          next();
        } else {
          next();
        }
      })
    )
    .pipe(sourcemaps ? sourcemaps.write({ sourceRoot: file => path.relative(path.join(file.cwd, file.path), file.base) }) : through2.obj())
    .pipe(gulp.dest(destDir));
}

function compileCJS () {
  const { dest } = params;
  return compileScripts('cjs', dest.lib);
}

function compileES () {
  const { dest } = params;
  return compileScripts('es', dest.es);
}

function compileSFC () {
  const { dest, vue } = params;
  return gulp
    .src(vue)
    .pipe(sourcemaps ? sourcemaps.init() : through2.obj())
    .pipe(vueSFC ? vueSFC.default({ ext: '.ts' }) : through2.obj())
    .pipe((alias && project) ? alias({ configuration: project.config }) : through2.obj())
    .pipe(project ? project() : through2.obj())
    .pipe(babel({ root: process.cwd() }))
    .pipe(replace ? replace(/\.vue("|'){1}/g, '.js$1') : through2.obj())
    .pipe(sourcemaps ? sourcemaps.write({ sourceRoot: file => path.relative(path.join(file.cwd, file.path), file.base) }) : through2.obj())
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

function copyStylesheet () {
  const { dest, styles } = params;
  return gulp
    .src(styles)
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

function handleLess (file) {
  let result = false;
  if (!less) return result;
  if (file.path.match(/.less$/)) {
    result = true;
  }

  return result;
}

function handleSass (file) {
  let result = false;
  if (!sass) return result;
  if (file.path.match(/.(scss|sass)$/)) {
    result = true;
  }

  return result;
}

function trans2css() {
  const { dest, styles } = params;
  return gulp
    .src(styles)
    .pipe(gulpif(handleLess, less ? less() : through2.obj()))
    .pipe(gulpif(handleSass, sass ? sass() : through2.obj()))
    .pipe(autoprefixer())
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es))
    .pipe(concatCss('index.css'))
    .pipe(concat('index.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

const builds = ${
  configurationPath
    ? 'customConfig'
    : 'gulp.parallel.apply(gulp, configuration({ task: [compileCJS, compileES, compileSFC, copyStylesheet, trans2css], params }));'
}

exports.build = builds;

exports.default = builds;
`;
}