const Bid = require("./Bid");
const Interests = require("./constants/Interests");
const Stages = require("./constants/Stages");

class Session {
    constructor() {
        this._name = "";
        this._programCommittee = [];
        this._papers = [];
        this._bids = [];
        this._stage = Stages.Receiving;
    }

    name() {
        return this._name;
    };

    /**
     * Obtener el programa de comite de la sesion. 
     * El programa de comite es un arreglo de objetos User.
     * @returns {User[]} Arreglo de objetos User que representan el programa de comite.
     */
    programCommittee() {
        return this._programCommittee;
    };

    /**
     * Obtener los revisores de la sesion.
     * @returns {User[]} Arreglo de objetos User que representan los revisores.
     */
    reviewers() {
        return this._programCommittee;
    };

    /**
     * Agregar un revisor al programa de comite de la sesion.
     * @param {User} user Objeto User que representa al revisor.
     */
    addReviewer(user) {
        this._programCommittee.push(user);
    }

    /**
     * Determinar si un paper puede ser enviado a la sesion.
     * El paper debe ser valido y la sesion debe estar en etapa de "Receiving"
     * @param {*} paper 
     * @returns {boolean} True si el paper puede ser enviado, false en caso contrario.
     */
    canSubmit(paper) {
        if (this.stage() == Stages.Receiving)
            return paper.isValid();
        else
            return false;
    }

    /**
     * Enviar un paper a la sesion.
     * El paper debe ser valido y la sesion debe estar en etapa de "Receiving"
     * @param {*} paper Objeto que representa el paper.
     */
    submit(paper) {
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");

        if (this.stage() == Stages.Receiving)
            this._papers.push(paper);
        else
            throw new Error("Cannot submit papers at this stage");
    }

    /**
     * Obtener los papers enviados a la sesion.
     * @returns {Paper[]} Arreglo de objetos Paper que representan los papers enviados.
     */
    papers() {
        return this._papers;
    }

    /**
     * Obtener las ofertas (bids) de la sesion.
     * @returns {Bid[]} Arreglo de objetos Bid que representan las ofertas.
     */
    bids() {
        return this._bids;
    }

    /**
     * Obtener la etapa actual de la sesion.
     * @returns {string} Etapa actual de la sesion.
     */
    stage() {
        return this._stage;
    }

    /**
     * Establecer la etapa actual de la sesion.
     * @param {string} stage Etapa a establecer.
     */
    setStage(stage) {
        this._stage = stage;
    }

    /**
     * Cerrar la etapa de recepción de papers y pasar a la etapa de "Bidding".
     * Una vez cerrada la etapa de recepción, no se pueden enviar más papers a la sesion.
     */
    closeSubmissions() {
        this.setStage(Stages.Bidding);
    }

    /**
     * Ingresar una oferta (bid) para un paper por un revisor.
     * @param {*} paper Objeto que representa el paper.
     * @param {*} reviewer Objeto que representa al revisor.
     * @param {*} interest Nivel de interes del revisor en el paper.
     */
    enterBid(paper, reviewer, interest) {
        if (this.stage() == Stages.Bidding)
            if (this.bidExistsFor(paper, reviewer)) {
                let existing = this.bidFor(paper, reviewer);
                existing.setInterest(interest);
            }
            else {
                let bid = new Bid(paper, reviewer, interest);
                this._bids.push(bid);
            }
        else
            throw new Error("Cannot enter bids from the current stage.");
    }

    /**
     * Determinar si existe una oferta (bid) para un paper por un revisor.
     * @param {*} paper Objeto que representa el paper.
     * @param {*} reviewer Objeto que representa al revisor.
     * @returns {boolean} True si existe una oferta, false en caso contrario.
     */
    bidExistsFor(paper, reviewer) {
        return this.bidFor(paper, reviewer) !== undefined;
    }

    /**
     * Obtener la oferta (bid) para un paper por un revisor.
     * @param {*} paper Objeto que representa el paper.
     * @param {*} reviewer Objeto que representa al revisor.
     * @returns {Bid} Objeto Bid que representa la oferta.
     */
    bidFor(paper, reviewer) {
        return this._bids.find((suspect) => (suspect.paper() == paper) && (suspect.reviewer() == reviewer));
    }

    /**
     * Obtener el nivel de interes de un revisor en un paper.
     * @param {*} paper Objeto que representa el paper.
     * @param {*} reviewer Objeto que representa al revisor.
     * @returns {Interests} Nivel de interes del revisor en el paper.
     */
    interestFor(paper, reviewer) {
        return this.bidFor(paper, reviewer).interest();
    }
}

module.exports = Session;