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
class ActionCompiler {
    constructor() {
        this.regexes = [
            [ "blank", /^\s+/ ],
            [ "keyword", /^[a-z]+/ ],
            [ "number", /^\d+/ ],
            [ "string", /^"(\\\\|\\"|[^"])*"/m ],
            [ "parOpen", /^\(/ ],
            [ "parClose", /^\)/ ],
            [ "comma", /^,/ ],
            [ "semicolon", /^;/ ]
        ]

        this.automaton = {
            "new action": { keyword: "open parenthesis" },

            "open parenthesis": { parOpen: "first parameter" },

            "first parameter": {
                parClose: "action end",
                string: "separator",
                number: "separator"
            },

            "separator": {
                parClose: "action end",
                comma: "next parameter"
            },

            "next parameter": {
                string: "separator",
                number: "separator"
            },

            "action end": { semicolon: "new action" }
        }

        this.tokens = []
        this.actions = []
        this.offset = 0
        this.error = ""
    }

    readToken(code, id, regex) {
        const match = regex.exec(code.substr(this.offset))
        if(match === null) return false

        if(id !== "blank") {
            this.tokens.push({
                type: id,
                value: match[0],
                offset: this.offset
            })
        }

        this.offset += match[0].length
        return true
    }

    lexicalAnalyze(code) {
        this.tokens = []
        this.offset = 0

        while(this.regexes.some(
            regex => this.readToken(code, regex[0], regex[1])
        ));

        return this.offset === code.length
    }

    compile(code) {
        this.actions = []

        if(!this.lexicalAnalyze(code)) {
            this.error = "Unexpected character @" + this.offset
            return null
        }

        let state = "new action"
        this.currentAction = {
            type: "",
            parameters: []
        }

        this.tokens.some(token => {
            if(this.automaton[state][token.type] === undefined) {
                this.error = "Unexpected " + token.type
                           + " while waiting for " + state
                           + " @" + token.offset
                return true
            }

            if(token.type === "semicolon") {
                this.actions.push(this.currentAction)
                this.currentAction = {
                    type: "",
                    parameters: []
                }
            } else if(token.type === "keyword") {
                this.currentAction.type = token.value
            } else if(token.type === "number") {
                this.currentAction.parameters.push(parseInt(token.value))
            } else if(token.type === "string") {
                this.currentAction.parameters.push(
                    token.value.substr(1, token.value.length - 2)
                )
            }

            state = this.automaton[state][token.type]

            return false
        })

        if(this.error !== "") return null

        if(state !== "new action") {
            this.error = "Unexpected end while waiting for " + state
            return null
        }

        return this.actions
    }
}
