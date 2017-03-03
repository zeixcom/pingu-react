const Generator = require('yeoman-generator');
const changeCase = require('change-case');

module.exports = class PinguContainerGenerator extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What shall the container be called?',
      }
    ]).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    const dashed = changeCase.param(this.name);
    const camel = changeCase.camelCase(this.name);

    this.fs.copyTpl(
      this.templatePath('container.js'),
      this.destinationPath(`src/containers/${dashed}.js`),
      { camel }
    );
  }

  end() {
    this.log(`🐧  enjoyed creating a nifty container.`);
  }
}
