import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack-stream';
import runSequence from 'run-sequence';

let plugins = gulpLoadPlugins();

gulp.task('build', cb => runSequence('clean',['build:babel', 'build:css'], 'build:webpack', 'clean:tmp', cb));

gulp.task('build:webpack', () => gulp.src('.tmp/*.js')
    .pipe(plugins.plumber())
    .pipe(webpack({
      output: {
        filename: 'datetime-range.min.js',
        libraryTarget: 'umd'
        },
      externals: {
        "angular": "angular",
        "moment": "moment",
        "moment-range": {
          root: "moment-range",
          umd: "moment-range"
        },
        "moment-timezone": {
          root: "moment-timezone",
          umd: "moment-timezone"
        }
      }
    }))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist'))
    .on('error', function (err) { console.error(err); }));

gulp.task('build:webpack:dev', () => gulp.src('.tmp/*.js')
  .pipe(plugins.plumber())
  .pipe(webpack({
    output: {
      filename: 'datetime-range.js',
      libraryTarget: 'umd'
    },
    externals: {
      "angular": "angular",
      "moment": "moment",
      "moment-range": {
        root: "moment-range",
        umd: "moment-range"
      },
      "moment-timezone": {
        root: "moment-timezone",
        umd: "moment-timezone"
      }
    }
  }))
  .pipe(gulp.dest('dist'))
  .on('error', function (err) { console.error(err); }));

gulp.task('build:babel', () => gulp.src('src/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.babel())
    .pipe(plugins.angularEmbedTemplates({logger:console.log, debug:true}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('.tmp'))
    .on('error', function (err) { console.error(err); }));

gulp.task('build:css', () => gulp.src('src/*.css')
  .pipe(plugins.plumber())
  .pipe(plugins.cssnano())
  .pipe(plugins.concat('datetime-range.min.css'))
  .pipe(gulp.dest('dist')))
  .on('error', function (err) { console.error(err); });

gulp.task('build:dev', () => {
  gulp.src('src/*.css')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('dist'));
  return gulp.src('src/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.babel())
    .pipe(plugins.angularEmbedTemplates({logger:console.log, debug:true}))
    .pipe(gulp.dest('.tmp'))
    .on('error', function (err) { console.error(err); });
});

gulp.task('clean', () => del('dist'));
gulp.task('clean:tmp', () => del('.tmp'));

gulp.task('dev:build', cb => runSequence('clean','build:dev', 'build:webpack:dev', 'clean:tmp', cb));

gulp.task('dev', cb => runSequence('dev:build', 'watch', cb));

gulp.task('watch', function() {
  gulp.watch(['src/**/*.+(js|html|css)', 'index.*'], ['dev:build']);
});
