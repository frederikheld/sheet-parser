'use strict'

module.exports = SheetParser

function SheetParser () { }

SheetParser.prototype.parseBlocks = function (code) {
    const blocks = code.matchAll(/\[{2}(.+?):]{2}\n([\S\s\n]*?)\n{2}/g)

    return [...blocks].map(function (value) {
        return {
            name: value[1],
            text: value[2]
        }
    })
}

SheetParser.prototype.parseLine = function (line) {
    /*
     * Split line into chunks
     */

    // split by whitespaces:
    const chunksRaw = line.split(' ')

    const chunksFixed = []

    // split by chords:
    for (let i = 0; i < chunksRaw.length; i++) {
        const subChunks = chunksRaw[i].split('[')

        // fix broken chords tags:
        if (subChunks.length > 1) {
            // add the [ that was removed from the
            // sub-chunks due to the split-operation:
            for (let j = 1; j < subChunks.length; j++) {
                subChunks[j] = '[' + subChunks[j]
            }

            // filter out empty chunks if tag
            // was at the beginning of a chunk:
            if (subChunks[0] !== '') {
                // first can't be conjoined as it has no predecessor:
                chunksFixed.push({
                    textRaw: subChunks[0]
                })

                // all the others have predecessors and are conjoined:
                for (let j = 1; j < subChunks.length; j++) {
                    chunksFixed.push({
                        textRaw: subChunks[j],
                        conjoined: true
                    })
                }
            } else {
                // chunks with an empty predecessor aren't actually conjoined
                // but at the start of the line:
                chunksFixed.push({
                    textRaw: subChunks[1]
                })
            }
        } else {
            chunksFixed.push({
                textRaw: subChunks[0]
            })
        }
    }

    // flatten resulting nested array:
    const chunks = chunksFixed

    /*
     * Parse chords and text
     */

    for (let i = 0; i < chunks.length; i++) {
        const matches = chunks[i].textRaw.match(/^(\[(.+?)])?(.*)$/)

        chunks[i].chord = matches[2]
        chunks[i].text = (matches[3] !== '') ? matches[3] : undefined
    }

    console.log('chunks:', chunks)

    return chunks
}
