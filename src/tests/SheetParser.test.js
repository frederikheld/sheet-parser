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
