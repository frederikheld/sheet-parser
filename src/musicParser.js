'use strict'

const MusicParser = function (blockCode) {
    this.blockCode = blockCode
}

MusicParser.prototype.splitLines = function () {
    const lines = this.blockCode.replace('\r\n').split('\n')

    const result = []
    for (let i = 0; i < lines.length; i++) {
        result.push({ code: lines[i] })
    }

    return result
}

MusicParser.prototype.parseLine = function (lineCode) {
    /*
     * Split line into chunks
     */

    // split by whitespaces:
    const chunksRaw = lineCode.split(' ')

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
                    code: subChunks[0]
                })

                // all the others have predecessors and are conjoined:
                for (let j = 1; j < subChunks.length; j++) {
                    chunksFixed.push({
                        code: subChunks[j],
                        conjoined: true
                    })
                }
            } else {
                // chunks with an empty predecessor aren't actually conjoined
                // but at the start of the line:
                chunksFixed.push({
                    code: subChunks[1]
                })
            }
        } else {
            chunksFixed.push({
                code: subChunks[0]
            })
        }
    }

    // flatten resulting nested array:
    const chunks = chunksFixed

    /*
     * Parse chords and text
     */

    for (let i = 0; i < chunks.length; i++) {
        const matches = chunks[i].code.match(/^(\[(.+?)])?(.*)$/)

        chunks[i].chord = matches[2]
        chunks[i].text = (matches[3] !== '') ? matches[3] : undefined
    }

    return chunks
}

module.exports = MusicParser
