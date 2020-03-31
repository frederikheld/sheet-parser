'use strict'

const SheetParser = require('../SheetParser')

const chai = require('chai')
chai.should()
const expect = chai.expect

/**
 * This test serves as an example of this function's input and output.
 * It's kind of an duplicate to the tests below, of which each tests
 * one specific aspect of the function. But it makes is simpler to
 * grasp the full concept compared to the detailed tests.
 */
describe('SheetParser.parseLine() full example', () => {
    const sheetParser = new SheetParser()

    const result = sheetParser.parseLine('[C] [G]Jumps o[C]ver the la-[G]aaa[C]zy [Am]dog. [C]')

    result.should.deep.equal([
        { textRaw: '[C]', chord: 'C', text: undefined },
        { textRaw: '[G]Jumps', chord: 'G', text: 'Jumps' },
        { textRaw: 'o', chord: undefined, text: 'o' },
        { textRaw: '[C]ver', conjoined: true, chord: 'C', text: 'ver' },
        { textRaw: 'the', chord: undefined, text: 'the' },
        { textRaw: 'la-', chord: undefined, text: 'la-' },
        { textRaw: '[G]aaa', conjoined: true, chord: 'G', text: 'aaa' },
        { textRaw: '[C]zy', conjoined: true, chord: 'C', text: 'zy' },
        { textRaw: '[Am]dog.', chord: 'Am', text: 'dog.' },
        { textRaw: '[C]', chord: 'C', text: undefined }
    ])
})

describe('SheetParser.parseLine() detailed', () => {
    let sheetParser

    beforeEach(() => {
        sheetParser = new SheetParser()
    })

    it('returns an array of objects', () => {
        const result = sheetParser.parseLine('[Em]The quick brown [Am]fox')

        result.should.be.an('array')

        for (let i = 0; i < result.length; i++) {
            result[i].should.be.an('object')
        }
    })

    describe('each object represents one chunk of the line, which ...', () => {
        it('is delimited by whitespaces and line start/ending', () => {
            const result1 = sheetParser.parseLine('[Em]The quick brown [Am]fox')
            result1.should.have.length(4)

            const result2 = sheetParser.parseLine('[Em] The quick brown [Am]fox')
            result2.should.have.length(5)

            const result3 = sheetParser.parseLine('[Em]The quick brown [Am]fox [C]')
            result3.should.have.length(5)
        })

        it('can also be delimited by a chord tag beginning in the middle of a word', () => {
            const result1 = sheetParser.parseLine('[G]Jumps o[C]ver the la[G]zy dog.')
            result1.should.have.length(7)

            const result2 = sheetParser.parseLine('[G]Jumps o[C]ver the la-[G]aaa[C]zy [Am]dog.')
            result2.should.have.length(8)
        })

        describe('each chunk', () => {
            describe('has a field "chord"', () => {
                it('which contains the content of the chord tag, if the chunk does start with a chord tag', () => {
                    const result = sheetParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    result[0].chord.should.equal('E')
                    result[1].chord.should.equal('C')
                    result[4].chord.should.equal('G')
                    result[5].chord.should.equal('C')
                    result[6].chord.should.equal('E')
                })
                it('which is undefined, if the chunk does not start with a chord tag', () => {
                    const result = sheetParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    expect(result[2].chord).to.equal(undefined)
                    expect(result[3].chord).to.equal(undefined)
                })
            })

            describe('has a field "text"', () => {
                it('which contains the text of the chunk, if it has text', () => {
                    const result = sheetParser.parseLine('The [G]quick [G7]brown [C]fox [E] [C]')
                    result[0].text.should.equal('The')
                    result[1].text.should.equal('quick')
                    result[2].text.should.equal('brown')
                    result[3].text.should.equal('fox')
                })

                it('which is undefined, if the chunk has no text', () => {
                    const result = sheetParser.parseLine('The [G]quick [G7]brown [C]fox [E] [C]')
                    expect(result[4].text).to.equal(undefined)
                    expect(result[5].text).to.equal(undefined)
                })
            })

            describe('can have a field "conjoined"', () => {
                it('has the value true, of the previous block is not separated by a whitespace', () => {
                    const result = sheetParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
                    result[4].conjoined.should.equal(true)

                    const result2 = sheetParser.parseLine('[E]Jumps [C]over the la-[G]aaaa[G7]zy [C]dog. [E]')
                    result2[4].conjoined.should.equal(true)
                    result2[5].conjoined.should.equal(true)
                })

                it('does not exist, if the previous block is separated by a whitespace', () => {
                    const result = sheetParser.parseLine('[E]Jumps [C]over the la[G]zy [C]dog. [E]')
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
