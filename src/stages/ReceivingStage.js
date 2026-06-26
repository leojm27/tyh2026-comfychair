const SessionStage = require("./SessionStage");

/**
 * Clase que representa la etapa de recepción de trabajos de la sesión.
 * En esta etapa, los autores pueden enviar sus trabajos para su consideración.
 * Una vez que se cierra la etapa de recepción, se pasa a la etapa de licitación.
 */
class ReceivingStage extends SessionStage {

    canSubmit(paper) {
        return paper.isValid();
    }

    submit(session, paper) {
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");
        session._papers.push(paper);
    }

    updatePaper(session, paper, updater) {
        if (!session._papers.includes(paper))
            throw new Error("Paper was not submitted to this session.");
        updater(paper);
        if (!paper.isValid())
            throw new Error("Updated paper is no longer valid.");
    }

    closeSubmissions(session) {
        const BiddingStage = require("./BiddingStage");
        session.setStage(new BiddingStage());
    }
}

module.exports = ReceivingStage;
