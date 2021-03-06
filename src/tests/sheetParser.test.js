'use strict'

const SheetParser = require('../sheetParser')
const chai = require('chai')
chai.should()
const expect = chai.expect

describe('function SheetParser', () => {
    describe('parseMetaTag(\'name\') --> the general representation of a meta tag', () => {
        it('follows the pattern \'{{name:value}}\'', () => {
            const parser1 = new SheetParser('{{foo:bar}}')
            parser1.parseMetaTag('foo').should.equal('bar')

            const parser2 = new SheetParser('{{name:value}}')
            parser2.parseMetaTag('name').should.equal('value')
        })

        it('the value can be anything but curly braces', () => {
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

            for (let i = 0; i < allowedTestData.length; i++) {
                const parser = new SheetParser('{{name:' + allowedTestData[i] + '}}')
                parser.parseMetaTag('name').should.equal(allowedTestData[i])
            }
        })

        it('does return undefined if the value contains curly braces', () => {
            /* not allowed values */
            const notAllowedTestData = [
                /* curly braces only */
                '{', '}', '{{', '}}', '{}',

                /* curly braces embedded in other characters */
                '{foo}', 'foo}bar{baz',

                /* another tag as value (nested tags) */
                '{{artist:foo}}', '{{title:foo}}'
            ]

            for (let i = 0; i < notAllowedTestData.length; i++) {
                const parser = new SheetParser('{{name:' + notAllowedTestData[i] + '}}')
                expect(parser.parseMetaTag('name')).to.be.undefined
            }
        })

        it('multiple tags can be in the same string, but each tag has to be in a line by itself (no text or other tags in the same line allowed)', () => {
        /* allowed sheet code */
            const parserAllowed1 = new SheetParser('this is some text\n{{artist:foo}}\nthis is more text')
            parserAllowed1.parseMetaTag('artist').should.equal('foo')

            const parserAllowed2 = new SheetParser('{{artist:foo}}\n{{title:bar}}')
            parserAllowed2.parseMetaTag('artist').should.equal('foo')
            parserAllowed2.parseMetaTag('title').should.equal('bar')

            /* not allowed sheet code */
            const parserNotAllowed1 = new SheetParser('{{artist:foo}}{{title:bar}}')
            expect(parserNotAllowed1.parseMetaTag('artist')).to.be.undefined
            expect(parserNotAllowed1.parseMetaTag('title')).to.be.undefined

            const parserNotAllowed2 = new SheetParser('some text\n{{artist:foo}}{{title:bar}}\nsome more text')
            expect(parserNotAllowed2.parseMetaTag('artist')).to.be.undefined
            expect(parserNotAllowed2.parseMetaTag('title')).to.be.undefined

            const parserNotAllowed3 = new SheetParser('{{artist:foo}}text in same line')
            expect(parserNotAllowed3.parseMetaTag('artist')).to.be.undefined

            const parserNotAllowed4 = new SheetParser('text in same line{{artist:foo}}')
            expect(parserNotAllowed4.parseMetaTag('artist')).to.be.undefined
        })

        it('returns the value of the last occurence if the tag name occurs multiple times in the string', () => {
            const parser1 = new SheetParser('{{artist:foo}}\n{{artist:bar}}')
            parser1.parseMetaTag('artist').should.equal('bar')

            const parser2 = new SheetParser('{{artist:foo}}\n{{title:bar}}\n{{artist:baz}}')
            parser2.parseMetaTag('artist').should.equal('baz')
        })

        // it('has to come before the first line of non-meta content (except for blank lines which come in between meta tags)')
    })

    describe('parseStringMetaTag(\'name\') to parse string meta tags', () => {
        it('returns an object { value: \'value\' }', () => {
            const parser = new SheetParser('{{foo:bar}}')
            parser.parseStringMetaTag('foo').value.should.equal('bar')
        })
    })

    describe('parseUrlEnabledMetaTag(\'name\') to parse url-enabled meta tags', () => {
        context('value is not an url (does not start with http:// or https://)', () => {
            const testData = [
                'Songbook A', 'Album Booklet', 'Foo', 'Bar'
            ]
            it('returns an object { value: \'value\', type: \'text\' }', () => {
                for (let i = 0; i < testData.length; i++) {
                    const parser = new SheetParser('{{name:' + testData[i] + '}}')
                    parser.parseUrlEnabledMetaTag('name').should.eql({ value: testData[i], type: 'text' })
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

            it('returns an object { value: \'value_excerpt\', type: \'hyperlink\', hyperlink: \'value\' }, while value_excerpt is the domain part of the value including subdomains (note: www is not considered a subdomain here!)', () => {
                for (let i = 0; i < testData.length; i++) {
                    const parser = new SheetParser('{{name:' + testData[i].raw_value + '}}')
                    parser.parseUrlEnabledMetaTag('name').should.eql({ value: testData[i].extracted_text, type: 'hyperlink', hyperlink: testData[i].raw_value })
                }
            })
        })
    })
})
