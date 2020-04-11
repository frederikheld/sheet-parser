'use strict'

const sheetParser = require('../sheetParser')

const chai = require('chai')
chai.should()
const expect = chai.expect

describe('sheetParser module', () => {
    it('exports the function "parseMeta"', () => {
        expect(() => {
            sheetParser.parseMeta('sheet code')
        }).to.not.throw()
    })

    it('exports the function "parseMusic"', () => {
        expect(() => {
            sheetParser.parseMusic('sheet code')
        }).to.not.throw()
    })
})
