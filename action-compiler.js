/**
 * @file action-compiler.js
 * @author Frédéric BISSON <zigazou@free.fr>
 * @version 1.0
 *
 * This is an action compiler dedicated to a-maze.
 */

/**
 * This is an action compiler dedicated to a-maze.
 */
class LexicalAnalyzer {
    constructor() {
        this.regexes = {
            blank: /^\s+/,
            keyword: /^[a-z]+/,
            number: /^\d+/,
            string: /^"[^"]*"/,
            parOpen: /^\(/,
            parClose: /^\)/,
            comma: /^,/,
            semicolon: /^;/
        }

        this.tokens = []
    }

    findToken(code, offset, regex, id) {
        const match = regex.exec(code.substr(offset))
        if(match !== null) {
            this.tokens.push({
                type: id,
                value: match[0],
                offset: offset
            })
            return true
        }

        return false
    }

    analyze(code) {
        let offset = 0
        let found = true

        while(found) {
            found = this.regexes.some(
                (regex, id) => this.findToken(code, offset, regex, id)
            )

            if(!found) {
                this.error = "Unexpected char @" + offset
                break
            } else {
                offset += this.tokens[this.tokens.length - 1].length
            }
        }
    }
}
