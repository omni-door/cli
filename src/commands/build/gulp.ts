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
const less = require_cwd('gulp-less');
const sass = require_cwd('gulp-sass');
const autoprefixer = require_cwd('gulp-autoprefixer');
const cssnano = require_cwd('gulp-cssnano');
const concat = require_cwd('gulp-concat');
const minifycss = require_cwd('gulp-minify-css');
const through2 = require_cwd('through2');

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

function trans2css() {
  const { dest, styles } = params;
  return gulp
    .src(styles)
    .pipe(less())
    .pipe(sass())
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