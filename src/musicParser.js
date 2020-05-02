'use strict'

const MusicParser = function (blockCode) {
    this.blockCode = blockCode
}

MusicParser.prototype.splitLines = function () {
    const lines = this.blockCode.replace('\r\n').split('\n')

    const result = []
    for (let i = 0; i < lines.length; i++) {
        result.push({ code: lines[i] })
    }

    return result
}

module.exports = MusicParser
