'use strict'

module.exports = SheetParser

function SheetParser (sheetCode) {
    this.code = sheetCode
}

SheetParser.prototype.parseBlocks = function () {
    const blocks = this.code.matchAll(/\[{2}(.+?):]{2}\n([\S\s\n]*?)\n{2}/g)

    return [...blocks].map(function (value) {
        return {
            name: value[1],
            text: value[2]
        }
    })
}
