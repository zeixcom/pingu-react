const Generator = require('yeoman-generator');
const changeCase = require('change-case');

module.exports = class PinguReduxGenerator extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What shall the partial state be called?',
      },
      {
        type: 'confirm',
        name: 'addSagas',
        message: 'Should sagas be created?',
        default: false,
      },
    ]).then(answers => {
      this.name = answers.name;
      this.addSagas = answers.addSagas;
    });
  }

  writing() {
    const dashed = changeCase.param(this.name);

    this.fs.copyTpl(
      this.templatePath('action.js'),
      this.destinationPath(`src/actions/${dashed}.js`)
    );

    this.fs.copyTpl(
      this.templatePath('reducer.js'),
      this.destinationPath(`src/reducers/${dashed}.js`),
      { dashed }
    );

    if (this.addSagas) {
      this.fs.copyTpl(
        this.templatePath('saga.js'),
        this.destinationPath(`src/sagas/${dashed}.js`),
        { dashed }
      )
    }

  }

  end() {
    this.log(`🐧  enjoyed creating terrific redux actions and reducers.`);
  }
}
