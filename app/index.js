const Generator = require('yeoman-generator');
const commandExists = require('command-exists');

module.exports = class PinguGenerator extends Generator {
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
      'react-intl',
      'react-redux',
      'react-router-dom',
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

    const files = [
      'src/default-state.js',
      'src/index.js',
      'src/reducers.js',
      'src/store.js',
      'src/assets/css/styles.scss',
      'src/sagas/root.js',
      '.eslintignore',
      '.eslintrc.json',
    ];

    files.map(file => this.fs.copyTpl(this.templatePath(file), this.destinationPath(`${file}`)));
  }

  end() {
    if (!this.createFiles && !this.addDeps) {
      this.log(`🐧  did't do anything, but enjoyed being here.`);
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
