const Generator = require('yeoman-generator');
const path = require('path');

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

    this.yarnInstall([
      'babel-polyfill',
      'redux',
      'react-redux',
      'react-router-dom@next',
      'react-router-redux',
      'redux-saga',
    ]);

    this.yarnInstall([
      'node-sass',
      'react-test-renderer',
      'sass-loader',
    ], { dev: true })
  }

  writing() {
    if (!this.createFiles) {
      return;
    }

    const files = [
      'default-state.js',
      'index.js',
      'reducers.js',
      'store.js',
      'assets/styles.scss',
      'sagas/root.js',
    ];

    files.map(file => this.fs.copyTpl(this.templatePath(file), this.destinationPath(`src/${file}`)));
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
