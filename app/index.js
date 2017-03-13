const Generator = require('yeoman-generator');
const commandExists = require('command-exists');

module.exports = class PinguGenerator extends Generator {
  _rewriteWebpackConfig() {
    const webpackPath = this.destinationPath('./config/webpack.config.dev.js');
    const webpackConfig = require(this.destinationPath('./config/webpack.config.dev.js'));
    const StyleLintPlugin = require('stylelint-webpack-plugin');
    const lintOptions = require(this.templatePath('./config/.stylelintrc.json'));
    const newConf = '';
    const pinguWebpackConfig = {
      module: {
        loaders: [
          {
            test: /\.(scss|sass)$/,
            loaders: ['style', 'css', 'sass'],
          }
        ]
      },
      plugins: [
        new StyleLintPlugin(lintOptions),
      ]
    };


    this.log(pinguWebpackConfig);

    if (webpackConfig) {
      newConf = merge(webpackConfig, pinguWebpackConfig);

      this.log(newConf);

      this.fs.write(this.destinationPath('./config/webpack.config.dev2.js'), JSON.stringify(newConf));
    }

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
      'css-loader',
      'style-loader',
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
      'src/assets/css/',
      'src/sagas/root.js',
      '.eslintrc.json',
    ];

    files.map(file => this.fs.copyTpl(this.templatePath(file), this.destinationPath(`${file}`)));

    done();
    this._rewriteWebpackConfig();

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
