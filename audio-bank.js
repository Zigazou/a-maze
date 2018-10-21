/**
 * @file audio-bank.js
 * @author Frédéric BISSON <zigazou@free.fr>
 * @version 1.0
 *
 * An audio bank is able to load and play sounds.
 */

/**
 * An audio bank is able to load and play sounds.
 */
class AudioBank {
    constructor(basedir) {
        /**
         * Base directory.
         * @member {string}
         * @private
         */
        this.basedir = basedir

        /**
         * The audio bank, Audio elements indexed by their URL.
         * @member {Audio}
         * @private
         */
        this.bank = {}
    }

    /**
     * Play a sound.
     * @param {string} sound URL of the sound to play.
     */
    play(sound) {
        if(!(sound in this.bank)) {
            this.bank[sound] = new Audio(this.basedir + "/" + sound)
        }

        this.bank[sound].play()
    }
}
