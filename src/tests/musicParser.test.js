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

    describe('MusicParser.parseLine() --> parses a single line of sheet code', () => {
        it('returns an array of objects that represent one chunk each', () => {
            const musicParser = new MusicParser()
            const result = musicParser.parseLine('Should [C]auld acquaintance [G]be forgot')

            result.length.should.equal(5)

            for (let i = 0; i < result.length; i++) {
                result[i].should.be.an('object')
            }
        })

        describe('a chunk', () => {
            it('can be delimited by whitespaces as well as line start and end', () => {
                const musicParser = new MusicParser()

                const result1 = musicParser.parseLine('[Em]The quick brown [Am]fox')
                result1.should.have.length(4)

                const result2 = musicParser.parseLine('[Em] The quick brown [Am]fox')
                result2.should.have.length(5)

                const result3 = musicParser.parseLine('[Em]The quick brown [Am]fox [C]')
                result3.should.have.length(5)
            })

            it('can also be delimited by a chord tag beginning in the middle of a word', () => {
                const musicParser = new MusicParser()

                const result1 = musicParser.parseLine('[G]Jumps o[C]ver the la[G]zy dog.')
                result1.should.have.length(7)

                const result2 = musicParser.parseLine('[G]Jumps o[C]ver the la-[G]aaa[C]zy [Am]dog.')
                result2.should.have.length(8)
            })
        })

        describe('the chunk object', () => {
            describe('has a field "chord"', () => {
                it('which contains the content of the chord tag, if the chunk does start with a chord tag', () => {
                    const musicParser = new MusicParser()

                    const result = musicParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    result[0].chord.should.equal('E')
                    result[1].chord.should.equal('C')
                    result[4].chord.should.equal('G')
                    result[5].chord.should.equal('C')
                    result[6].chord.should.equal('E')
                })
                it('which is undefined, if the chunk does not start with a chord tag', () => {
                    const musicParser = new MusicParser()

                    const result = musicParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    expect(result[2].chord).to.equal(undefined)
                    expect(result[3].chord).to.equal(undefined)
                })
            })

            describe('has a field "text"', () => {
                it('which contains the text of the chunk, if it has text', () => {
                    const musicParser = new MusicParser()

                    const result = musicParser.parseLine('The [G]quick [G7]brown [C]fox [E] [C]')
                    result[0].text.should.equal('The')
                    result[1].text.should.equal('quick')
                    result[2].text.should.equal('brown')
                    result[3].text.should.equal('fox')
                })

                it('which is undefined, if the chunk has no text', () => {
                    const musicParser = new MusicParser()

                    const result = musicParser.parseLine('The [G]quick [G7]brown [C]fox [E] [C]')
                    expect(result[4].text).to.equal(undefined)
                    expect(result[5].text).to.equal(undefined)
                })
            })

            describe('can have a field "conjoined"', () => {
                it('has the value true, of the previous block is not separated by a whitespace', () => {
                    const musicParser = new MusicParser()

                    const result = musicParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    result[4].conjoined.should.equal(true)

                    const result2 = musicParser.parseLine('[E]Jumps [C]over the la-[G]aaaa[G7]zy [C]dog. [E]')
                    result2[4].conjoined.should.equal(true)
                    result2[5].conjoined.should.equal(true)
                })

                it('does not exist, if the previous block is separated by a whitespace', () => {
                    const musicParser = new MusicParser()

                    const result = musicParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    expect(result[0]).to.not.have.property('conjoined')
                    expect(result[1]).to.not.have.property('conjoined')
                    expect(result[2]).to.not.have.property('conjoined')
                    expect(result[3]).to.not.have.property('conjoined')
                    expect(result[5]).to.not.have.property('conjoined')
                    expect(result[6]).to.not.have.property('conjoined')
                })
            })
        })
    })
})
