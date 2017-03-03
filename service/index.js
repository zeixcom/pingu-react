const Generator = require('yeoman-generator');
const changeCase = require('change-case');

module.exports = class PinguServiceGenerator extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What shall the service be called?',
      }
    ]).then(answers => {
      this.name = answers.name;
    });
  }

  writing() {
    const dashed = changeCase.param(this.name);
    const pascal = changeCase.pascal(this.name);
    const camel = changeCase.camelCase(this.name);

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(`src/services/${dashed}/index.js`),
      { dashed }
    );

    this.fs.copyTpl(
      this.templatePath('service.js'),
      this.destinationPath(`src/services/${dashed}/${dashed}.js`),
      { camel }
    );

    this.fs.copyTpl(
      this.templatePath('service.test.js'),
      this.destinationPath(`src/services/${dashed}/${dashed}.test.js`),
      { camel, dashed, pascal }
    );
  }

  end() {
    this.log(`🐧  enjoyed creating a neat service.`);
  }
}
