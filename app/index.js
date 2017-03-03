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
      'redux',
      'react-redux',
      'react-router-dom@next',
      'react-router-redux',
      'redux-saga',
    ];

    const devDeps = [
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
