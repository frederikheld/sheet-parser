'use strict'

const sheetParser = require('../reference_implementation')

const fs = require('fs').promises
const path = require('path')

const chai = require('chai')
chai.should()

describe('the reference implementation', () => {
    let sheetCode
    before(async () => {
        sheetCode = await fs.readFile(path.join(__dirname, 'mock_data', 'reference_sheet.txt'), 'utf8')
    })
    describe('use parseMeta(\'sheetCode\') to extract meta data from the sheet code', () => {
        describe('available tags', () => {
            describe('string tags (plain text)', () => {
                it('{{artist:value}} to specify the artist', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.artist.value.should.equal('The Artist')
                })

                it('{{title:value}} to specify the title of the song', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.title.value.should.equal('The Song Title')
                })

                it('{{album:value}} to specify the title of the album (this version of) the song appears on', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.album.value.should.equal('The Album Title')
                })

                it('{{year:value}} to specify the year in which (this version of) the song was released', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.year.value.should.equal('2001')

                    // TODO: Make this an date/year tag
                })

                it('{{known_from:value}} to specify where (this version of) the song is known from (e. g. a movie, show, musical, commercial, ...)', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.known_from.value.should.equal('A Movie or Show Title')
                })

                it('{{original_artist:value}} to specify the original artist\'s name of the song if it is a cover version', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.original_artist.value.should.equal('The Original Artist')
                })
            })
            describe('url-enabled tags (url or plain text)', () => {
                it('{{source:value}} to specify the source of this sheet', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.source.value.should.equal('example.com')
                    result.source.type.should.equal('hyperlink')
                    result.source.hyperlink.should.equal('https://example.com')
                })

                it('{{listen:value}} to specify where one can listen to (this version of) the song', () => {
                    const result = sheetParser.parseMeta(sheetCode)
                    result.listen.value.should.equal('example.com')
                    result.listen.type.should.equal('hyperlink')
                    result.listen.hyperlink.should.equal('https://example.com/listen/here')

                    // TODO: make this an url-only tag!
                })
            })
        })
    })
})
