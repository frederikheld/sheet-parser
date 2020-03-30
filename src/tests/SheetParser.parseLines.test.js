'use strict'

const SheetParser = require('../SheetParser')

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('SheetParser.parseLines()', () => {
    let sheetParser

    beforeEach(() => {
        /*
        // mockLines = [
        //     '[Em]The quick brown [Am]fox',
        //     '[G] Jumps over the lazy [C]dog.',
        //     'The [Em]quick brown fox [Am]',
        //     'Jumps over [G] the lazy dog. [G7] [C]',
        //     'The[Em]he fooo-[Am]ho-ho-hoo-[C]oooox'
        // ]

        // expectedResult = [
        //     [
        //         { chord: 'Em', text: 'The' },
        //         { chord: undefined, text: 'quick' },
        //         { chord: undefined, text: 'brown' },
        //         { chord: 'Am', text: 'fox' }
        //     ],
        //     [
        //         { chord: 'G', text: undefined },
        //         { chord: undefined, text: 'Jumps' },
        //         { chord: undefined, text: 'over' },
        //         { chord: undefined, text: 'the' },
        //         { chord: undefined, text: 'lazy' },
        //         { chord: 'C', text: 'dog.' }
        //     ],
        //     [
        //         { chord: undefined, text: 'The' },
        //         { chord: 'Em', text: 'quick' },
        //         { chord: undefined, text: 'brown' },
        //         { chord: undefined, text: 'fox' },
        //         { chord: 'Am', text: undefined }
        //     ],
        //     [
        //         { chord: undefined, text: 'Jumps' },
        //         { chord: undefined, text: 'over' },
        //         { chord: 'G', text: undefined },
        //         { chord: undefined, text: 'the' },
        //         { chord: undefined, text: 'lazy' },
        //         { chord: undefined, text: 'dog.' },
        //         { chord: 'G7', text: undefined },
        //         { chord: 'C', text: undefined }
        //     ],
        //     [
        //         { chord: undefined, text: 'The', conjoined: true },
        //         { chord: 'Em', text: 'he' },
        //         { chord: undefined, text: 'fooo-', conjoined: true },
        //         { chord: 'Am', text: 'ho-ho-ho-hoo-', conjoined: true },
        //         { chord: 'C', text: 'oooox' }
        //     ]
        // ]
        */

        sheetParser = new SheetParser()
    })

    it('returns an array of chunks, while a chunk is the text between two whitespaces ...', () => {
        const result1 = sheetParser.parseLine('[Em]The quick brown [Am]fox')
        result1.length.should.equal(4)

        const result2 = sheetParser.parseLine('[G] Jumps over the lazy [C]dog.')
        result2.length.should.equal(6)
    })

    it('... or started by a chord separating a word', () => {
        const chunksRaw = sheetParser.parseLine('[G] Jumps o[C]ver the la[G]zy dog.')
        chunksRaw.should.have.length(8)
    })

    describe('each chunk', () => {
        let chunks
        beforeEach(() => {
            chunks = sheetParser.parseLine('[G] Jumps o[C]ver the la-[G]aaa[C]zy [Am]dog. [E]')
        })

        it('is an object with the fields "chord" and "text"', () => {
            for (let i = 0; i < chunks.length; i++) {
                chunks[i].should.be.an('object')

                chunks[i].should.have.any.keys('chord', 'text')
            }
        })

        it(`can have the field "conjoined" which is set to true,
only if the previous chunk is not split by a blank`, () => {
            expect(chunks[0].conjoined).to.equal(undefined)
            expect(chunks[1].conjoined).to.equal(undefined)
            expect(chunks[2].conjoined).to.equal(undefined)

            chunks[3].conjoined.should.equal(true)

            expect(chunks[4].conjoined).to.equal(undefined)
            expect(chunks[5].conjoined).to.equal(undefined)

            chunks[6].conjoined.should.equal(true)
            chunks[7].conjoined.should.equal(true)

            expect(chunks[8].conjoined).to.equal(undefined)
            expect(chunks[9].conjoined).to.equal(undefined)
        })

        describe('the field "chord"', () => {
            it('contains the name of the chord (e. g. Em) if the chunk starts with a chord tag (e. g. [Em])', () => {
                const chunks = sheetParser.parseLine('[Em]The quick brown [Am]fox')

                chunks[0].chord.should.equal('Em')
                chunks[3].chord.should.equal('Am')
            })

            it('is undefined, if the chunk doesn\'t start with a chord tag', () => {
                const chunks = sheetParser.parseLine('[Em]The quick brown [Am]fox')

                expect(chunks[1].chord).to.equal(undefined)
                expect(chunks[2].chord).to.equal(undefined)
            })
        })

        describe('the field "text"', () => {
            it('contains the text of the chunk', () => {
                const chunks = sheetParser.parseLine('[Em]The quick brown [Am]fox')

                chunks[0].text.should.equal('The')
                chunks[1].text.should.equal('quick')
                chunks[2].text.should.equal('brown')
                chunks[3].text.should.equal('fox')
            })

            it('is undefined, if the chunk has no text', () => {
                const chunks = sheetParser.parseLine('[Em] The quick [Am] brown fox [C]')

                expect(chunks[0].text).to.equal(undefined)
                expect(chunks[3].text).to.equal(undefined)
                expect(chunks[6].text).to.equal(undefined)
            })
        })
    })
})

// describe.only('SheetParser.splitLineIntoChunks()', () => {
//     let sheetParser

//     beforeEach(() => {
//         sheetParser = new SheetParser()
//     })

//     it('returns an array of objects with one object per chunk', () => {
//         const chunks = sheetParser.splitLineIntoChunks('The quick brown fox')

//         chunks.should.have.length(4)

//         for (let i = 0; i < chunks.length; i++) {
//             chunks[i].should.be.an('object')

//             chunks[i].should.have.keys('chord', 'text')
//         }
//     })

//     // it('creates a split at each whitespace', () => {
//     //     const chunksRaw = sheetParser.splitLineIntoChunks('[Em]The quick brown [Am]fox')
//     //     chunksRaw.should.have.length(4)
//     //     chunksRaw.should.deep.equal(['[Em]The', 'quick', 'brown', '[Am]fox'])
//     // })

//     // it('also creates a split at the start of a chord tag, if it is embedded in a word', () => {
//     //     const chunksRaw = sheetParser.splitLineIntoChunks('Jumps o[C]ver the la[G]zy dog.')
//     //     chunksRaw.should.have.length(7)
//     //     chunksRaw.should.deep.equal(['Jumps', 'o', '[C]ver', 'the', 'la', '[G]zy', 'dog.'])
//     // })
// })
