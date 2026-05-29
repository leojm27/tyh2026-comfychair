const Interests = require("./constants/Interests");

class Bid {
    constructor(paper, reviewer, interest) {
        this._paper = paper;
        this._reviewer = reviewer;
        this._interest = interest;

    }

    /**
     * Devuelve el paper asociado a la oferta.
     * @returns 
     */
    paper() {
        return this._paper;
    }

    /**
     * Devuelve el revisor asociado a la oferta.
     * @returns 
     */
    reviewer() {
        return this._reviewer;
    }

    /**
     * Devuelve el interés asociado a la oferta.
     * @returns 
     */
    interest() {
        return this._interest;
    }

    /**
     * Establece el interés asociado a la oferta.
     * @param {*} interest 
     */
    setInterest(interest) {
        this._interest = interest;
    }
}
module.exports = Bid;