'use strict'

const sheetParser = require('../sheetParser')
const chai = require('chai')
const should = chai.should()

describe('function "parseMeta"', () => {
    it('extracts information from meta tags {{tag:value}} and returns it as an object of tag/value pairs', () => {
        const sheetCode = `{{title:Foo}}
{{artist:Bar}}`

        const result = sheetParser.parseMeta(sheetCode)

        result.should.be.an('object')
        Object.keys(result).length.should.equal(2)

        result.title.should.equal('Foo')
        result.artist.should.equal('Bar')
    })

    it('returns an empty object if no tag was found', () => {
        const sheetCode = 'Foo Bar Baz'

        const result = sheetParser.parseMeta(sheetCode)

        result.should.be.an('object').that.is.empty
    })

    describe('available meta tags', () => {
        describe('string tags', () => {
            /* values that are allowed */
            const allowedTestData = [
                /* single world */
                'Joe', 'John',

                /* multiple words */
                'Joe Cocker',
                'Sergeant Pepper\'s loneley Hearts Club Band',

                /* leading and trailing blanks */
                'Joe ', ' Joe', ' Joe ',
                'Joe Cocker ', ' Joe Cocker', ' Joe Cocker ',

                /* empty value */
                '',

                /* special chars */
                '![]', '#', '??',

                /* special chars that are part of the tag */
                ':'
                // note that curly braces are not allowed!
            ]

            /* values that are not allowed */
            const notAllowedTestData = [
                /* curly braces only */
                '{', '}', '{{', '}}', '{}',

                /* curly braces embedded in other characters */
                '{foo}', 'foo}bar{baz',

                /* nested tags */
                '{{artist:foo}}', '{{title:foo}}'
            ]

            describe('{{artist:value}}', () => {
                it('can have a value that is anything but curly braces', () => {
                    for (let i = 0; i < allowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{artist:' + allowedTestData[i] + '}}')

                        result.artist.should.equal(allowedTestData[i])
                    }
                })

                it('does not set "artist" if the value contains curly braces', () => {
                    for (let i = 0; i < notAllowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{artist:' + notAllowedTestData[i] + '}}')

                        should.not.exist(result.artist)
                    }
                })
            })

            describe('{{title:value}}', () => {
                it('can have a value that is anything but curly braces', () => {
                    for (let i = 0; i < allowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{title:' + allowedTestData[i] + '}}')

                        result.title.should.equal(allowedTestData[i])
                    }
                })

                it('does not set "title" if the value contains curly braces', () => {
                    for (let i = 0; i < notAllowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{title:' + notAllowedTestData[i] + '}}')

                        should.not.exist(result.title)
                    }
                })
            })
        })
    })
})
