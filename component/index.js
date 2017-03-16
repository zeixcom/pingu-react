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
      },
      {
        type: 'confirm',
        name: 'storybook',
        message: 'Should storybook stories be created?',
        default: false,
      }
    ]).then(answers => {
      this.tier = answers.tier;
      this.name = answers.name;
      this.storybook = answers.storybook;
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


    const rootSassFile = this.fs.read(this.destinationPath('src/assets/css/styles.scss'));
    const baseRegexSass = new RegExp(`(\\/\\/.+\\@import)\\n\\/\\/.+\\'components\\/any';`, 'g');
    const matchBaseRegex = rootSassFile.match(baseRegexSass);
    const alreadyExistsRegex = new RegExp(`\\'..\\/..\\/components.+\\';`, 'g');
    const alreadyExistsMatch = rootSassFile.match(alreadyExistsRegex);

    let rootSassFileModified = rootSassFile;

    // We determine if there are already any components included in the .scss file
    if (matchBaseRegex !== null) {
      rootSassFileModified = rootSassFile.replace(baseRegexSass, `@import\n  '../../components/${this.tier}/${dashed}/${dashed}';`);
    } else {
      // Check if it is even possible to do that
      if (alreadyExistsMatch.length >= 1) {
        rootSassFileModified = rootSassFile.replace(alreadyExistsRegex,
        `${alreadyExistsMatch[0].replace(';', ',')}\n  '../../components/${this.tier}/${dashed}/${dashed}';`);
      } else {
        this.log(`🐧  had a problem adding your new component style to the style scss file. Very sad.`);
      }
    }

    this.fs.write(this.destinationPath('src/assets/css/styles.scss'), rootSassFileModified);

    if (this.storybook) {
      this.fs.copyTpl(
        this.templatePath('component.stories.js'),
        this.destinationPath(`src/components/${this.tier}/${dashed}/${dashed}.stories.js`),
        { proper: changeCase.pascal(this.name) }
      );
    }
  }

  end() {
    this.log(`🐧  enjoyed creating a ${this.tier} that is cool as ice for you.`);
  }
}
