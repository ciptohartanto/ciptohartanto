var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var prefix = require('gulp-autoprefixer');
var del = require('del');
// runSequence is to make sure that each task is done before running the next task that is in the queue
var runSequence = require('run-sequence');
var spritesmith = require('gulp.spritesmith');
var sourcemaps = require('gulp-sourcemaps');
var converter = require('sass-convert');
var svgSprite = require("gulp-svg-sprites");
var htmlmin = require('gulp-htmlmin');


// variables of base
var base = {
  dist: 'dist/',
  source: 'src/'
};

// variables of paths
var paths = {
  scripts: ['assets/js/'],
  images: ['assets/img/'],
  sprite: ['sprite/'],
  sass: ['sass/'],
  scss: ['scss/'],
  css: ['assets/css/'],
  jade: ['jade/']
};



// cleanDist is to delete dist/
gulp.task('cleanDist', function () {
  return del(base.dist);
  return stream;
});

// cleanDist is to delete scss/
gulp.task('cleanSCSS', function () {
  return del(base.source + paths.scss);
  return stream;
});


// copy-assets is to copy all folders in assets/
gulp.task('copy-assets', function () {
  gulp.src(base.source + 'assets/**')
    .pipe(gulp.dest(base.dist + 'assets'));
});


// jade is to compile Jade and Pug files to HTML
gulp.task('jade', function () {
  return gulp.src(base.source + paths.jade + "**/*.jade")
    .pipe(jade({
      pretty: false,  // uncompressed
    }))
    .pipe(gulp.dest(base.dist));
});


// sass is to compile Sass files to CSS
gulp.task('sass', function () {
  return gulp.src(base.source + paths.sass + "**/*.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
        }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest(base.dist + paths.css))
    .pipe(browserSync.stream());
});

gulp.task('sass2SCSS', function () {
  return gulp.src('src/sass/**/*.+(sass|scss|css)')
    .pipe(converter({
      from: 'scss',
      to: 'sass',
    }))
    .pipe(gulp.dest('src/scss/'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(base.source + paths.sprite + '*.png').pipe(spritesmith({
    imgName: '../img/sprite.png',
    cssName: '_sprite.sass',
    padding: 4
  }));
  spriteData.img.pipe(gulp.dest(base.source + paths.images));
  spriteData.css.pipe(gulp.dest(base.source + paths.sass + 'tools/'));
});

gulp.task('svg-sprites', function () {
  return gulp.src(base.source + paths.sprite + '*.svg')
      .pipe(svgSprite({
        cssFile: "../src/sass/tools/_spriteSVG.scss",
        svg: {
          sprite: "img/spriteSVG.svg"
        }
      }))
      .pipe(gulp.dest("src/"));
});

gulp.task('minify', () => {
  return gulp.src('src/jade/svg-code/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('src/jade/svg-code'));
});

// Serve is starting BrowserSync
// it's also watching Sass, Jade, and assets/
gulp.task('serve', function () {
  browserSync.init({
    server: base.dist
  });
  gulp.watch(base.source + paths.sass + "**/*.sass", ['sass']);
  // gulp.watch(base.source + paths.sass + "**/*.sass", ['sass2SCSS']);
  gulp.watch(base.source + paths.jade + "*.jade", ['jade']);
  gulp.watch(base.source + paths.sprite + '*.png', ['sprite']);
  gulp.watch(base.source + paths.sprite + '*.svg', ['svg-sprites']);
  gulp.watch(base.source + paths.images + '**/*', ['copy-assets']);
  gulp.watch(base.source + paths.scripts + '**/*', ['copy-assets']);
  gulp.watch(base.source + paths.sass + "**/*.sass").on('change', browserSync.reload);
  gulp.watch(base.source + paths.jade + "*.jade").on('change', browserSync.reload);
  gulp.watch(base.source + paths.images + "**/*").on('change', browserSync.reload);
  // gulp.watch(base.source + paths.scripts + '**/*').on('change', browserSync.reload);
  gulp.watch(base.source + paths.sprite + '*.png').on('change', browserSync.reload);

  

});



// we need 'default' task in order to initialize Gulp
// gulp.task('default', function () {
//   runSequence('cleanDist', 'cleanSCSS','sprite', 'svg-sprites', 'copy-assets', 'sass', 'jade', 'serve');
// });


gulp.task('default', function () {
  runSequence('cleanDist', 'cleanSCSS', 'copy-assets', 'sass', 'jade', 'serve');
});

gulp.task('netlify', function () {
  runSequence('cleanDist', 'cleanSCSS', 'copy-assets', 'sass', 'jade', 'minify');
});
