'use strict'

/**
 * Helper function that makes sure that all
 * regular expressions for meta tags follow
 * the same rules.
 */
const regExpFactory = function (tagName) {
    return new RegExp('^{{' + tagName + ':(.*)}}$', 'm')
}

const parseMeta = function (sheetCode) {
    const result = {}

    /* STRING TAGS */

    /* {{artist:value}} */
    const artistMatch = sheetCode.match(regExpFactory('artist'))
    if (artistMatch) {
        if (
            artistMatch[1].indexOf('{') === -1 &&
            artistMatch[1].indexOf('}') === -1
        ) {
            result.artist = artistMatch[1]
        }
    }

    /* {{title:value}} */
    const titleMatch = sheetCode.match(regExpFactory('title'))
    if (titleMatch) {
        if (
            titleMatch[1].indexOf('{') === -1 &&
            titleMatch[1].indexOf('}') === -1
        ) {
            result.title = titleMatch[1]
        }
    }

    /* {{album:value}} */
    const albumMatch = sheetCode.match(regExpFactory('album'))
    if (albumMatch) {
        if (
            albumMatch[1].indexOf('{') === -1 &&
            albumMatch[1].indexOf('}') === -1
        ) {
            result.album = albumMatch[1]
        }
    }

    /* HYPERLINK ENABLED TAGS */

    const regex = {
        /* checks if a string starts with http:// or https:// */
        isHyperlink: /http(s?):\/\//,

        // /* matches domain.tld in strings that also match isHyperlink */
        // domain: /https?:\/\/(.*?\.)?(.+?\..+?)([/?#].*)?$/,

        /* matches subdomains.domain.tld (except for subdomain www!) in strings that also match isHyperlink */
        fullDomain: /https?:\/\/(www\.)?(.+?\..+?)([/?#].*)?$/
    }

    /* {{source:value}} */
    const sourceMatch = sheetCode.match(regExpFactory('source'))
    if (sourceMatch) {
        result.source = {
            text: sourceMatch[1]
        }

        if (sourceMatch[1].search(regex.isHyperlink) >= 0) {
            result.source.type = 'hyperlink'
            result.source.hyperlink = sourceMatch[1]
            result.source.text = sourceMatch[1].match(regex.fullDomain)[2]
        } else {
            result.source.type = 'text'
        }
    }

    return result
}

const parseMusic = function (sheetCode) {
    return sheetCode
}

module.exports.parseMeta = parseMeta
module.exports.parseMusic = parseMusic
