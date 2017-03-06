const Generator = require('yeoman-generator');
const changeCase = require('change-case');

const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const generate = require('babel-generator').default;

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
    const camelCase = changeCase.camel(this.name);
    const reducerKey = camelCase.replace('Reducer', '');

    this.fs.copyTpl(
      this.templatePath('action.js'),
      this.destinationPath(`src/actions/${dashed}.js`)
    );

    this.fs.copyTpl(
      this.templatePath('reducer.js'),
      this.destinationPath(`src/reducers/${dashed}.js`),
      { dashed }
    );

    const rootReducer = this.fs.read(this.destinationPath('src/reducers.js'));
    const ast = babylon.parse(rootReducer, {
      sourceType: 'module',
    });

    let lastImportDeclaration = null;
    let firstElAfterImports = false;
    let insertedProperty = false;

    const isFirstAfterImports = path => (
      !t.isImportDeclaration(path.node) &&
      !t.isImportSpecifier(path.node) &&
      lastImportDeclaration !== null &&
      !t.isImportDeclaration(path.parent) &&
      !t.isImportSpecifier(path.parent) &&
      !t.isImportDefaultSpecifier(path.parent) &&
      !firstElAfterImports
    );

    const insertImport = () => (
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(`${camelCase}Reducer`))],
        t.stringLiteral(`./reducers/${dashed}`)
      )
    );

    traverse(ast, {
      enter(path) {
        if (isFirstAfterImports(path)) {
          lastImportDeclaration.insertAfter(insertImport());
          firstElAfterImports = true;
        }
      },

      ImportDeclaration(path) {
        lastImportDeclaration = path;
      },

      ObjectProperty(path) {
        if (!insertedProperty) {
          path.insertAfter(
            t.objectProperty(
              t.identifier(reducerKey),
              t.identifier(`${camelCase}Reducer`)
            )
          );

          insertedProperty = true;
        }
      }
    });

    const { code } = generate(ast, { quotes: 'single' }, rootReducer);

    this.fs.write(this.destinationPath('src/reducers.js'), code);

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
