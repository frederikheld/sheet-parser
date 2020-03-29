'use strict'

const SheetParser = require('../SheetParser')

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('SheetParser', () => {
    it('can be instantiated as an object with keyword new', () => {
        expect(function () {
            new SheetParser() // eslint-disable-line no-new
        }).to.not.throw()
    })
})

describe('SheetParser.parseBlocks()', () => {
    let mockCode
    let expectedResult

    let sheetParser
    let blocks

    beforeEach(() => {
        mockCode = `[[verse1:]]
Should [G]auld acquaintance [D]be forgot,
And [Em]never brought to [C]mind?
Should [G]auld acquaintance [D]be forgot,
And [Em]auld [C]lang [G]syne!

[[chorus:]]
[C]For [G]auld lang [D]syne, my dear,
[C]For [G]auld lang [C]syne.
We'll [G]take a cup o' [D]kindness yet,
For [Em]auld [C]lang [G]syne.

`

        expectedResult = [
            {
                name: 'verse1',
                text: `Should [G]auld acquaintance [D]be forgot,
And [Em]never brought to [C]mind?
Should [G]auld acquaintance [D]be forgot,
And [Em]auld [C]lang [G]syne!`
            },
            {
                name: 'chorus',
                text: `[C]For [G]auld lang [D]syne, my dear,
[C]For [G]auld lang [C]syne.
We'll [G]take a cup o' [D]kindness yet,
For [Em]auld [C]lang [G]syne.`
            }
        ]

        sheetParser = new SheetParser(mockCode)
        blocks = sheetParser.parseBlocks()
    })

    it('considers everything between an block opening tag (e. g. [[chorus:]]) and a blank line as a block and returns an array of all blocks', () => {
        blocks.length.should.equal(2)
    })

    it('returns the name of a block as field "name"', () => {
        blocks[0].name.should.equal(expectedResult[0].name)
    })

    it('returns the text of a block as field "text"', () => {
        blocks[0].text.should.equal(expectedResult[0].text)
        blocks[1].text.should.equal(expectedResult[1].text)
    })
})

// describe('SheetParser.parseLines()', () => {

// })
