'use strict'

/**
 * Helper function that makes sure that all
 * regular expressions for meta tags follow
 * the same rules.
 */
const regExpFactory = function (tagName) {
    return new RegExp('^{{' + tagName + ':(.*)}}$', 'm')
}

const SheetParser = function (sheetCode) {
    this.sheetCode = sheetCode
}

/**
 * Defines generic characteristics of a meta tag.
 */
SheetParser.prototype.parseMetaTag = function (tagName) {
    const match = this.sheetCode.match(new RegExp('^{{' + tagName + ':(.*)}}$', 'm'))

    if (
        match &&
        match[1].indexOf('{') === -1 &&
        match[1].indexOf('}') === -1
    ) {
        return match[1]
    }

    return undefined
}

const parseMeta = function (sheetCode) {
    const sheetParser = new SheetParser(sheetCode)
    const result = {}

    /* STRING TAGS */
    const allowedStringTags = [
        'artist', 'title', 'album'
    ]

    for (let i = 0; i < allowedStringTags.length; i++) {
        const value = sheetParser.parseMetaTag(allowedStringTags[i])
        if (value !== undefined) {
            result[allowedStringTags[i]] = value
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
module.exports.SheetParser = SheetParser
