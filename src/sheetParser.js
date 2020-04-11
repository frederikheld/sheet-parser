'use strict'

const parseMeta = function (sheetCode) {
    const result = {}

    /* {{title:value}} */
    const titleMatch = sheetCode.match(/\{\{title:(.*?)\}\}/)
    if (titleMatch) {
        // if (
        //     titleMatch.indexOf('{') === -1 &&
        //     titleMatch.indexOf('}') === -1
        // ) {
        result.title = titleMatch[1]
        // }
    }

    /* {{artist:value}} */
    const artistMatch = sheetCode.match(/\{\{artist:(.*)\}\}/)
    if (artistMatch) {
        if (
            artistMatch[1].indexOf('{') === -1 &&
            artistMatch[1].indexOf('}') === -1
        ) {
            result.artist = artistMatch[1]
        }
    }

    return result
}

const parseMusic = function (sheetCode) {
    return sheetCode
}

module.exports.parseMeta = parseMeta
module.exports.parseMusic = parseMusic
