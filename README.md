# sheet-parser
Parser for [_freds-songbook-2_](https://github.com/frederikheld/freds-songbook-2) that returns the given sheet code as an object of the sheet's components.

Reference implementation of the notation format used in _freds-songbook-2_.

## Compatibility notes

This package makes use of `String.prototype.matchAll()` which is available starting with Node 12.0.0. Therefore versions before Node 12 are not supported!

## Develop

### Tooling

This project comes with a config for _VSCode_ that supports
* Automated _ESLint_ formatting when file is being saved using [Dirk Baeumer's _vscode-eslint_ extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
* Automated _Mocha_ test runs when file is being saved and integration of test results into _VSCode_ using [Holger Benl's _Mocha Test Explorer_ extension](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter). In order to run this extension, you will also need [Holger Benl's _Test Explorer UI_ extension](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer)
* Auto-generated coverage reports using [emeraldwalk's _Run on Save_ extension](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.runonsave)

    > If you don't want to auto-generate coverage (it might take a while on huge projects), you can run `npm run coverage-lcov` instead to update coverage information.

* Code coverage highlighting within _VSCode_ using
    * as the unobstrusive option that also gives a hint why the line was highlighted on mouse hover: [Markis Taylor's _Code Coverage_ extension](markis.code-coverage).
    * as the striking option that shows coverage percentage in the status bar with the option to toggle highlighting: [Brainfit's _Code Coverage Highlighter_ extension](https://marketplace.visualstudio.com/items?itemName=brainfit.vscode-coverage-highlighter).

    > You can use both extensions together as both have their specific advantages. There's also plenty of other coverage highlighting plugins in the store that consume _lcov_ coverage data that you can choose from.
