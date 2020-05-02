'use strict'

const MusicParser = require('../musicParser')
const chai = require('chai')
chai.should()
const expect = chai.expect

describe('function MusicParser', () => {
    describe('MusicParser.splitLines() --> splits a block into lines', () => {
        const exampleCodeBlock =
`Should [C]auld acquaintance [G]be forgot
And [C]never brought to [F]mind?
Should [C]auld acquaintance [G]be forgot
And [C]days of [Am]auld lang [C]syne?`

        it('returns an array of objects that represent one line each', () => {
            const musicParser = new MusicParser(exampleCodeBlock)
            const result = musicParser.splitLines()

            result.length.should.equal(4)

            for (let i = 0; i < result.length; i++) {
                result[i].should.be.an('object')
            }
        })

        describe('the line object', () => {
            it('has a field \'code\' that contains the code of the respective line', () => {
                const musicParser = new MusicParser(exampleCodeBlock)
                const result = musicParser.splitLines()

                result[0].code.should.equal('Should [C]auld acquaintance [G]be forgot')
                result[1].code.should.equal('And [C]never brought to [F]mind?')
                result[2].code.should.equal('Should [C]auld acquaintance [G]be forgot')
                result[3].code.should.equal('And [C]days of [Am]auld lang [C]syne?')
            })
        })
    })
})
