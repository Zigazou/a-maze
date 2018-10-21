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
        /**
         * List of tokens found by lexical analyzer.
         * @member {Object[]}
         * @private
         */
        this.tokens = []

        /**
         * List of actions found by action compiler.
         * @member {Object[]}
         * @private
         */
        this.actions = []

        /**
         * Current offset while doing lexical analysis.
         * @member {number}
         * @private
         */
        this.offset = 0

        /**
         * Last encountered error.
         * @member {string}
         */
        this.error = ""
    }

    /**
     * Try to read a specific token type from a string. If the token type can be
     * read, the token list and current offset are updated.
     *
     * @param {string} code Code from which to extract a token.
     * @param {*} id Token type to extract.
     * @param {*} regex Regex dedicated to extract this kind of token.
     * @returns {boolean} true if a token has been read, false otherwise.
     * @private
     */
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

    /**
     * Extract tokens from a raw string.
     *
     * @param {string} code The string from which to extract tokens.
     * @returns {boolean} true if the string contains only fully recognized
     *                    tokens, false otherwise.
     * @private
     */
    lexicalAnalyze(code) {
        this.tokens = []
        this.offset = 0

        while(ActionCompiler.regexes.some(
            regex => this.readToken(code, regex[0], regex[1])
        ));

        return this.offset === code.length
    }

    /**
     * Compile a raw string into a list of actions to execute.
     *
     * @param {string} code The string to compile.
     * @returns {Object[]?} A list of compiled actions or null if there were any
     *                      error while compiling the code.
     */
    compile(code) {
        // Do the lexical analysis first.
        if(!this.lexicalAnalyze(code)) {
            this.error = "Unexpected character @" + this.offset
            return null
        }

        // Initializes the compiler.
        this.actions = []
        let state = "new action"
        this.currentAction = {
            type: "",
            parameters: []
        }

        this.tokens.some(token => {
            if(ActionCompiler.automaton[state][token.type] === undefined) {
                this.error = "Unexpected " + token.type
                           + " while waiting for " + state
                           + " @" + token.offset
                return true
            }

            if(token.type === "semicolon") {
                // The semicolon is a trigger to add the action to the list.
                this.actions.push(this.currentAction)
                this.currentAction = { type: "", parameters: [] }
            } else if(token.type === "keyword") {
                this.currentAction.type = token.value
            } else if(token.type === "number") {
                // Converts the string to an integer.
                this.currentAction.parameters.push(parseInt(token.value))
            } else if(token.type === "string") {
                // Removes the double quotes and escaping characters from the
                // string.
                this.currentAction.parameters.push(
                    token.value.substr(1, token.value.length - 2)
                               .replace(/\\"/g, "\"")
                               .replace(/\\\\/g, "\\")
                )
            }

            // Moves to the next statee.
            state = ActionCompiler.automaton[state][token.type]

            // false means we continue!
            return false
        })

        // An error has been encountered.
        if(this.error !== "") return null

        // The final state must be "new action".
        if(state !== "new action") {
            this.error = "Unexpected end while waiting for " + state
            return null
        }

        return this.actions
    }
}

/**
 * List of regexes used to detect tokens.
 * @member {string[][]}
 */
ActionCompiler.regexes = [
    ["blank", /^\s+/],
    ["keyword", /^[a-z]+/],
    ["number", /^\d+/],
    ["string", /^"(\\\\|\\"|[^"])*"/m],
    ["parOpen", /^\(/],
    ["parClose", /^\)/],
    ["comma", /^,/],
    ["semicolon", /^;/]
]

/**
 * The automaton for our small language. It is indexed by states. The value is
 * always another object indexed by token type and whose value is a state.
 * @member {Object}
 */
ActionCompiler.automaton = {
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
