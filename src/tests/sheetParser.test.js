'use strict'

const sheetParser = require('../sheetParser')

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('sheetParser module', () => {
    it('exports the function "parseMeta"', () => {
        expect(typeof sheetParser.parseMeta).to.equal('function')

        Object.keys(sheetParser.parseMeta.prototype).length.should.equal(0)
    })

    it('exports the function "parseMusic"', () => {
        expect(typeof sheetParser.parseMusic).to.equal('function')

        Object.keys(sheetParser.parseMusic.prototype).length.should.equal(0)
    })

    it('exports the function "SheetParser" that has prototyped methods', () => {
        expect(typeof sheetParser.SheetParser).to.equal('function')

        // has properties:
        Object.keys(sheetParser.SheetParser.prototype).length.should.be.greaterThan(0)

        // specifically test for expected properties:
        const parser = new sheetParser.SheetParser()
        const prototypes = Object.getPrototypeOf(parser)
        prototypes.should.have.keys([
            'parseMetaTag',
            'parseStringMetaTag',
            'parseUrlEnabledMetaTag'
        ])

        // check if those properties are functions:
        for (let i = 0; i < Object.keys(prototypes).length; i++) {
            expect(typeof prototypes[Object.keys(prototypes)[i]]).to.equal('function')
        }
    })
})
