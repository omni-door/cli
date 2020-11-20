export default function (config: {
  srcDir: string;
  outDir: string;
  esmDir: string;
}) {
  const { srcDir = 'src', outDir = 'lib', esmDir = 'es' } = config;

  return `'use strict';

const path = require('path');
const { require_cwd } = require('@omni-door/utils');
const gulp = require_cwd('gulp');
const babel = require_cwd('gulp-babel');
const less = require_cwd('gulp-less', true);
const sass = require_cwd('gulp-sass', true);
const gulpif = require_cwd('gulp-if');
const alias = require_cwd('gulp-ts-alias');
const typescript = require_cwd('gulp-typescript');
const sourcemaps = require_cwd('gulp-sourcemaps');
const autoprefixer = require_cwd('gulp-autoprefixer');
const cssnano = require_cwd('gulp-cssnano');
const concat = require_cwd('gulp-concat');
const minifycss = require_cwd('gulp-minify-css');
const through2 = require_cwd('through2');

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
    .pipe(concat('index.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

const buildScripts = gulp.series(compileCJS, compileES);

const build = gulp.parallel(buildScripts, copyStylesheet, trans2css);

exports.build = build;

exports.default = build;
`;
}