const Generator = require('yeoman-generator');
const commandExists = require('command-exists');

module.exports = class PinguGenerator extends Generator {
  _rewriteWebpackConfig() {
    const webpackConfig = this.fs.readJson('config/webpack.config.dev.js');

    const sassLoader = {
      test: /\.(scss|sass)$/,
      include: paths.appSrc,
      loaders: ['style', 'css', 'sass']
    };
    // const styleLintPlugin = {
    //   new require('stylelint-webpack-plugin')()
    // };

    webpackConfig.loaders.push({ sassLoader });
    // webpackConfig.plugins.push({ styleLintPlugin });

    this.fs.write('config/webpack.config.dev.js', JSON.stringify(webpackConfig));
  }

  prompting() {
    return this.prompt([
      {
        type: 'confirm',
        name: 'addDeps',
        message: 'Do you want to add npm packages for a full react/redux project?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'createFiles',
        message: 'Do you want to create the base structure for the project?',
        default: false,
      }
    ]).then(answers => {
      this.addDeps = answers.addDeps;
      this.createFiles = answers.createFiles;
    });
  }

  install() {
    if (!this.addDeps) {
      return;
    }

    const done = this.async();

    const deps = [
      'babel-polyfill',
      'immutable',
      'history',
      'lodash',
      'redux',
      'react-redux',
      'react-router-dom@next',
      'react-router-redux',
      'redux-saga',
    ];

    const devDeps = [
      'eslint@^3.15.0',
      'eslint-config-airbnb@^14.1.0',
      'eslint-plugin-jsx-a11y@^4.0.0',
      'eslint-plugin-import@^2.2.0',
      'eslint-plugin-react@^6.9.0',
      'node-sass',
      'react-test-renderer',
      'sass-loader',
      'stylelint-webpack-plugin',
    ];

    commandExists('yarn', (err, exists) => {
      if (exists) {
        this.yarnInstall(deps);
        this.yarnInstall(devDeps, { dev: true });
        done();
      } else {
        this.npmInstall(deps);
        this.npmInstall(devDeps, { dev: true });
        done();
      }
    });
  }

  writing() {
    if (!this.createFiles) {
      return;
    }

    const done = this.async();

    const files = [
      'src/default-state.js',
      'src/index.js',
      'src/reducers.js',
      'src/store.js',
      'src/assets/css/styles.scss',
      'src/sagas/root.js',
      '.eslintrc.json',
    ];

    files.map(file => this.fs.copyTpl(this.templatePath(file), this.destinationPath(`${file}`)));

    this.destinationRoot();
    const config = require('./config/webpack.config.dev.js');
    this.log(config);
    if (this.fs.exists('config/webpack.config.dev.js')) {
      this._rewriteWebpackConfig();
      done();
    }

  }

  end() {
    if (!this.createFiles && !this.addDeps) {
      this.log(`🐧  didn't do anything, but enjoyed being here.`);
      return;
    }

    const tasks = [];

    if (this.createFiles) {
      tasks.push('created file structure');
    }

    if (this.addDeps) {
      tasks.push('added npm dependencies');
    }

    const finished = tasks.length > 1 ? tasks.join(' and ') : tasks[0];

    this.log(`🐧  ${finished} and is now going back to antarctica.`);
  }
}
