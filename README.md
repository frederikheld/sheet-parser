# sheet-parser
Parser for [_freds-songbook-2_](https://github.com/frederikheld/freds-songbook-2) that returns the given sheet code as an object of the sheet's components.

Reference implementation of the notation format used in _freds-songbook-2_.

## Compatibility notes

This package makes use of `String.prototype.matchAll()` which is available starting with Node 12.0.0. Therefore versions before Node 12 are not supported!