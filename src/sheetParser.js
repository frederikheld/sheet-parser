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

module.exports = SheetParser
