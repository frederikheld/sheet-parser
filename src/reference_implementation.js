'use strict'

const SheetParser = require('./sheetParser')

const parseMeta = function (sheetCode) {
    const availableTags = [
        /* string tags */
        { name: 'artist', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'album', type: 'string' },
        { name: 'year', type: 'string' },
        { name: 'known_from', type: 'string' },
        { name: 'original_artist', type: 'string' },

        /* url-enabled tags */
        { name: 'source', type: 'url-enabled' },
        { name: 'listen', type: 'url-enabled' }
    ]

    const sheetParser = new SheetParser(sheetCode)
    const result = {}

    for (let i = 0; i < availableTags.length; i++) {
        if (!availableTags[i].type || availableTags[i].type === 'string') {
            /* string tags */
            result[availableTags[i].name] = sheetParser.parseStringMetaTag(availableTags[i].name)
        } else if (availableTags[i].type === 'url-enabled') {
            /* url-enabled tags */
            result[availableTags[i].name] = sheetParser.parseUrlEnabledMetaTag(availableTags[i].name)
        }
    }

    return result
}

const parseMusic = function (sheetCode) {
    const sheetParser = new SheetParser(sheetCode)
    const result = sheetParser.parseBlocks()
    return result
}

module.exports.parseMeta = parseMeta
module.exports.parseMusic = parseMusic
