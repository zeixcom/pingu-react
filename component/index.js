const Generator = require('yeoman-generator');
const changeCase = require('change-case');

module.exports = class PinguComponentGenerator extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'tier',
        message: 'Which category shall the component belong to?',
        choices: ['atoms', 'molecules', 'organisms'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What shall the component be called?',
      }
    ]).then(answers => {
      this.tier = answers.tier;
      this.name = answers.name;
    });
  }

  writing() {
    const dashed = changeCase.param(this.name);

    this.fs.copyTpl(
      this.templatePath('component.scss'),
      this.destinationPath(`src/components/${this.tier}/${dashed}/${dashed}.scss`),
      { name: changeCase.param(dashed) }
    );

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(`src/components/${this.tier}/${dashed}/index.js`),
      {
        original: this.name,
        proper: changeCase.pascal(this.name),
        dashed,
      }
    );

    this.fs.copyTpl(
      this.templatePath('component.test.js'),
      this.destinationPath(`src/components/${this.tier}/${dashed}/${dashed}.test.js`),
      { proper: changeCase.pascal(this.name) }
    );


    // if (!this.createFiles) {
    //   return;
    // }

    // const files = [
    //   'default-state.js',
    //   'index.js',
    //   'reducers.js',
    //   'store.js',
    //   'assets/styles.scss',
    //   'sagas/root.js',
    // ];

    // files.map(file => this.fs.copyTpl(this.templatePath(file), this.destinationPath(`src/${file}`)));
  }

  end() {
    this.log(`🐧  enjoyed creating a ${this.tier} that is cool as ice for you.`);
  }
}
