'use strict'

// /**
//  * Helper function that makes sure that all
//  * regular expressions for meta tags follow
//  * the same rules.
//  */
// const regExpFactory = function (tagName) {
//     return new RegExp('^{{' + tagName + ':(.*)}}$', 'm')
// }

const SheetParser = function (sheetCode) {
    this.sheetCode = sheetCode
}

/**
 * Defines generic characteristics of a meta tag.
 */
SheetParser.prototype.parseMetaTag = function (tagName, tagType = undefined) {
    // get all matches:
    const matches = [...this.sheetCode.matchAll(new RegExp('^{{' + tagName + ':(.*)}}$', 'gm'))]

    // use last occurence:
    const match = matches[matches.length - 1]

    // check if match exists and doesn't contain curly braces:
    if (
        match &&
        match[1].indexOf('{') === -1 &&
        match[1].indexOf('}') === -1
    ) {
        return match[1]
    }

    return undefined
}

/*
 * Defines the characteristics of a string meta tag
 */
SheetParser.prototype.parseStringMetaTag = function (tagName) {
    return { value: this.parseMetaTag(tagName) }
}

/*
 * Defines the charactersitics of an url-enabled meta tag
 */
SheetParser.prototype.parseUrlEnabledMetaTag = function (tagName) {
    const result = {}

    const regex = {
        /* checks if a string starts with http:// or https:// */
        isHyperlink: /http(s?):\/\//,

        /* matches subdomains.domain.tld (except for subdomain www!) in strings that also match isHyperlink */
        fullDomain: /https?:\/\/(www\.)?(.+?\..+?)([/?#].*)?$/
    }

    const value = this.parseMetaTag(tagName)

    if (value && value.search(regex.isHyperlink) >= 0) {
        result.type = 'hyperlink'
        result.hyperlink = value
        result.value = value.match(regex.fullDomain)[2]
    } else {
        result.value = value
        result.type = 'text'
    }

    return result
}

const parseMeta = function (sheetCode) {
    const availableTags = [
        /* string tags */
        { name: 'artist', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'album', type: 'string' },

        /* url-enabled tags */
        { name: 'source', type: 'url-enabled' }
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
    return sheetCode
}

module.exports.parseMeta = parseMeta
module.exports.parseMusic = parseMusic
module.exports.SheetParser = SheetParser
