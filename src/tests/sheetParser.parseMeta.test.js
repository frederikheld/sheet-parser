'use strict'

const sheetParser = require('../sheetParser')
const chai = require('chai')
const should = chai.should()

describe('function "parseMeta"', () => {
    it('extracts information from meta tags {{name:value}} and returns it as an object of name/value pairs', () => {
        const sheetCode = `{{title:Foo}}
{{artist:Bar}}`

        const result = sheetParser.parseMeta(sheetCode)

        result.should.be.an('object')
        result.should.have.keys(['title', 'artist'])
        result.title.should.equal('Foo')
        result.artist.should.equal('Bar')
    })

    it('returns an empty object if no tag was found', () => {
        const sheetCode = 'Foo Bar Baz'

        const result = sheetParser.parseMeta(sheetCode)

        result.should.be.an('object').that.is.empty
    })

    describe('a meta tag', () => {
        it('has to be in a line by itself (no text or other tags in same line allowed)', () => {
            /* allowed sheet code */
            const resultAllowed1 = sheetParser.parseMeta('this is some text\n{{artist:foo}}\nthis is more text')
            resultAllowed1.should.have.keys(['artist'])
            resultAllowed1.artist.should.equal('foo')

            const resultAllowed2 = sheetParser.parseMeta('{{artist:foo}}\n{{title:bar}}')
            resultAllowed2.should.have.keys(['artist', 'title'])
            resultAllowed2.artist.should.equal('foo')
            resultAllowed2.title.should.equal('bar')

            /* not allowed sheet code */
            const resultNotAllowed1 = sheetParser.parseMeta('{{artist:foo}}{{title:bar}}')
            resultNotAllowed1.should.not.have.keys(['artist', 'title'])

            const resultNotAllowed2 = sheetParser.parseMeta('some text\n{{artist:foo}}{{title:bar}}\nsome more text')
            resultNotAllowed2.should.not.have.keys(['artist', 'title'])

            const resultNotAllowed3 = sheetParser.parseMeta('{{artist:foo}}text in same line')
            resultNotAllowed3.should.not.have.keys(['artist'])

            const resultNotAllowed4 = sheetParser.parseMeta('text in same line{{artist:foo}}')
            resultNotAllowed4.should.not.have.keys(['artist'])
        })
    })

    describe('available meta tags', () => {
        describe('string tags', () => {
            /* allowed values */
            const allowedTestData = [
                /* single word */
                'Joe', 'John',

                /* multiple words */
                'Joe Cocker',

                /* leading and trailing blanks */
                'Joe ', ' Joe', ' Joe ',
                'Joe Cocker ', ' Joe Cocker', ' Joe Cocker ',

                /* empty value */
                '',

                /* numbers */
                'U2', 'Blink-182',

                /* special chars */
                '![]', '#', '??', '|!§',

                /* special chars that are part of the tag */
                ':',
                // note that curly braces are not allowed (see separate test)!

                /* names/titles with special chars that actually exist */
                'John Robert "Joe" Cocker',
                'Joe Cocker!',
                'Heart & Soul',
                'Sergeant Pepper\'s loneley Hearts Club Band',
                'The B-52\'s',
                '*NSYNC',
                'Panic! At the Disco',
                'HUMAN. :||: NATURE.',
                'BØRNS',
                'CHVRCHΞS',
                'Ty Dolla $ign',
                'Sixx:A.M.',
                '/\\/\\/\\Y/\\'
            ]

            /* not allowed values */
            const notAllowedTestData = [
                /* curly braces only */
                '{', '}', '{{', '}}', '{}',

                /* curly braces embedded in other characters */
                '{foo}', 'foo}bar{baz',

                /* another tag as value (nested tags) */
                '{{artist:foo}}', '{{title:foo}}'
            ]

            describe('{{artist:value}}', () => {
                it('can have a value that is anything but curly braces', () => {
                    for (let i = 0; i < allowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{artist:' + allowedTestData[i] + '}}')

                        result.artist.should.equal(allowedTestData[i])
                    }
                })

                it('does not set field \'artist\' if the value contains curly braces', () => {
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

                it('does not set field \'title\' if the value contains curly braces', () => {
                    for (let i = 0; i < notAllowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{title:' + notAllowedTestData[i] + '}}')

                        should.not.exist(result.title)
                    }
                })
            })

            describe('{{album:value}}', () => {
                it('can have a value that is anything but curly braces', () => {
                    for (let i = 0; i < allowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{album:' + allowedTestData[i] + '}}')

                        result.album.should.equal(allowedTestData[i])
                    }
                })

                it('does not set field \'album\' if the value contains curly braces', () => {
                    for (let i = 0; i < notAllowedTestData.length; i++) {
                        const result = sheetParser.parseMeta('{{album:' + notAllowedTestData[i] + '}}')

                        should.not.exist(result.album)
                    }
                })
            })
        })

        describe('hyperlink enabled tags', () => {
            describe('{{source:value}}', () => {
                it('returns a `source` object', () => {
                    const result = sheetParser.parseMeta('{{source:value}}')

                    result.source.should.be.a('object')
                })

                context('value is not an url (does not start with http:// or https://)', () => {
                    const testData = [
                        'Songbook A', 'Album Booklet', 'Foo'
                    ]
                    it('`source.text` contains the value as it is', () => {
                        for (let i = 0; i < testData.length; i++) {
                            const result = sheetParser.parseMeta('{{source:' + testData[i] + '}}')

                            result.source.text.should.equal(testData[i])
                        }
                    })

                    it('`source.type` contains string \'text\'', () => {
                        for (let i = 0; i < testData.length; i++) {
                            const result = sheetParser.parseMeta('{{source:' + testData[i] + '}}')

                            result.source.type.should.equal('text')
                        }
                    })

                    it('`source.hyperlink` does not exist', () => {
                        for (let i = 0; i < testData.length; i++) {
                            const result = sheetParser.parseMeta('{{source:' + testData[i] + '}}')

                            should.not.exist(result.source.hyperlink)
                        }
                    })
                })

                context('value is an url (starts with http:// or https://)', () => {
                    const testData = [
                        /* simple url */
                        { raw_value: 'http://domain.tld', extracted_text: 'domain.tld' },
                        { raw_value: 'https://domain.tld', extracted_text: 'domain.tld' },

                        /* url with subdomain */
                        { raw_value: 'http://subdomain.domain.tld', extracted_text: 'subdomain.domain.tld' },
                        { raw_value: 'https://subdomain.domain.tld', extracted_text: 'subdomain.domain.tld' },

                        /* url with multiple subdomains */
                        { raw_value: 'http://subsub.subdomain.domain.tld', extracted_text: 'subsub.subdomain.domain.tld' },
                        { raw_value: 'https://subsub.subdomain.domain.tld', extracted_text: 'subsub.subdomain.domain.tld' },

                        /* www is not counted as subdomain */
                        { raw_value: 'http://www.domain.tld', extracted_text: 'domain.tld' },
                        { raw_value: 'https://www.domain.tld', extracted_text: 'domain.tld' },

                        /* url with path */
                        { raw_value: 'https://www.domain.tld/path/to/dir', extracted_text: 'domain.tld' },
                        { raw_value: 'https://www.domain.tld/path/to/file.html', extracted_text: 'domain.tld' },

                        /* url with query string */
                        { raw_value: 'http://domain.tld?search=foo', extracted_text: 'domain.tld' },
                        { raw_value: 'http://domain.tld?search=foo&sort=bar', extracted_text: 'domain.tld' },
                        { raw_value: 'http://subdomain.domain.tld?search=foo&sort=bar', extracted_text: 'subdomain.domain.tld' },
                        { raw_value: 'https://domain.tld?search=foo', extracted_text: 'domain.tld' },
                        { raw_value: 'https://domain.tld?search=foo&sort=bar', extracted_text: 'domain.tld' },
                        { raw_value: 'https://subdomain.domain.tld?search=foo&sort=bar', extracted_text: 'subdomain.domain.tld' },
                        { raw_value: 'https://subdomain.domain.tld/path/to/dir/?search=foo&sort=bar', extracted_text: 'subdomain.domain.tld' },
                        { raw_value: 'https://subdomain.domain.tld/path/to/file.html?search=foo&sort=bar', extracted_text: 'subdomain.domain.tld' },

                        /* url with anchor */
                        { raw_value: 'http://domain.tld#foo', extracted_text: 'domain.tld' },
                        { raw_value: 'http://subdomain.domain.tld#foo', extracted_text: 'subdomain.domain.tld' },
                        { raw_value: 'https://domain.tld#foo', extracted_text: 'domain.tld' },
                        { raw_value: 'https://subdomain.domain.tld#foo', extracted_text: 'subdomain.domain.tld' },

                        /* url with query string and anchor */
                        { raw_value: 'http://domain.tld?search=foo&sort=bar#baz', extracted_text: 'domain.tld' },
                        { raw_value: 'http://subdomain.domain.tld?search=foo&sort=bar#baz', extracted_text: 'subdomain.domain.tld' },
                        { raw_value: 'https://domain.tld?search=foo&sort=bar#baz', extracted_text: 'domain.tld' },
                        { raw_value: 'https://subdomain.domain.tld?search=foo&sort=bar#baz', extracted_text: 'subdomain.domain.tld' }

                    ]

                    it('`source.text` contains the domain part of the value including subdomains (\'subdomains.domain.tld\', while www is not considered a subdomain)', () => {
                        for (let i = 0; i < testData.length; i++) {
                            const result = sheetParser.parseMeta('{{source:' + testData[i].raw_value + '}}')

                            result.source.text.should.equal(testData[i].extracted_text, 'failed with test data sample ' + i)
                        }
                    })

                    it('`source.type` contains string \'hyperlink\'', () => {
                        for (let i = 0; i < testData.length; i++) {
                            const result = sheetParser.parseMeta('{{source:' + testData[i].raw_value + '}}')

                            result.source.type.should.equal('hyperlink', 'failed with test data sample ' + i)
                        }
                    })

                    it('`source.hyperlink` contains the value as it is', () => {
                        for (let i = 0; i < testData.length; i++) {
                            const result = sheetParser.parseMeta('{{source:' + testData[i].raw_value + '}}')

                            result.source.hyperlink.should.equal(testData[i].raw_value, 'failed with test data sample ' + i)
                        }
                    })
                })
            })
        })
    })
})
