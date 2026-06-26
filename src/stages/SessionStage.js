
/**
 * Clase abstracta que representa un estado de la sesión. 
 * Cada estado tiene sus propias reglas de negocio y restricciones.
 */
class SessionStage {

    _notAllowed() {
        throw new Error("Operation not allowed in current stage.");
    }

    /** Por defecto ningun stage permite submit. ReceivingStage lo sobreescribe. */
    canSubmit(paper) {
        return false;
    }

    submit(session, paper) {
        this._notAllowed();
    }

    updatePaper(session, paper, updater) {
        this._notAllowed();
    }

    closeSubmissions(session) {
        this._notAllowed();
    }

    enterBid(session, paper, reviewer, interest) {
        this._notAllowed();
    }

    closeBidding(session) {
        this._notAllowed();
    }

    closeAssignment(session) {
        this._notAllowed();
    }

    submitReview(session, paper, reviewer, text, score) {
        this._notAllowed();
    }

    closeReviewing(session) {
        this._notAllowed();
    }

    selectPapers(session) {
        this._notAllowed();
    }
}

module.exports = SessionStage;
