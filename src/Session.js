const Bid = require("./Bid");
const Interests = require("./constants/Interests");
const Stages = require("./constants/Stages");

class Session {
    constructor(name = "") {
        this._name = name;
        this._programCommittee = [];
        this._papers = [];
        this._bids = [];
        this._assignments = [];
        this._acceptedPapers = [];
        this._stage = Stages.Receiving;
    }

    name() {
        return this._name;
    }

    programCommittee(){
        return this._programCommittee;
    }

    reviewers() {
        return this.programCommittee();
    }

    addReviewer(user) {
        this._programCommittee.push(user);
    }

    /** Devuelve true si el paper es valido y la sesion esta en etapa Receiving. */
    canSubmit(paper) {
        if (this.stage() == Stages.Receiving)
            return paper.isValid();
        else
            return false;
    }

    /** Envia un paper a la sesion. Lanza error si no es valido o la etapa no es Receiving. */
    submit(paper) {
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");
        this._papers.push(paper);
    }

    /** Valida las condiciones, aplica el cambio via updater y verifica que el paper siga siendo valido. */
    updatePaper(paper, updater) {
        if (this.stage() !== Stages.Receiving)
            throw new Error("Cannot update papers outside of Receiving stage.");
        if (!this._papers.includes(paper))
            throw new Error("Paper was not submitted to this session.");
        updater(paper);
        if (!paper.isValid())
            throw new Error("Updated paper is no longer valid.");
    }

    papers() {
        return this._papers;
    }

    bids() {
        return this._bids;
    }

    stage() {
        return this._stage;
    }

    setStage(stage) {
        this._stage = stage;
    }

    /** Receiving → Bidding. */
    closeSubmissions() {
        this.setStage(Stages.Bidding);
    }

    /** Bidding → Assignment. Dispara la asignacion automatica de revisores. */
    closeBidding() {
        this.setStage(Stages.Assignment);
        this._autoAssignReviewers();
    }

    /**
     * Asigna 3 revisores por paper en orden: Interested > Maybe > sin bid > NotInterested.
     * Respeta cuota maxima por revisor y excluye autores del paper (conflicto de interes).
     */
    _autoAssignReviewers() {
        const papers = this._papers;
        const reviewers = this._programCommittee;
        const quota = Math.ceil(3 * papers.length / reviewers.length);
        const assignmentCount = new Map(reviewers.map(r => [r, 0]));

        const priorityGroups = [Interests.Interested, Interests.Maybe, null, Interests.NotInterested];

        for (const paper of papers) {
            // 1. Criterios de elegibilidad: excluir autores del paper y revisores que agotaron su cuota.
            const eligible = reviewers.filter(revisor =>
                !paper.authors().includes(revisor) && assignmentCount.get(revisor) < quota
            );

            const assigned = [];

            for (const interestLevel of priorityGroups) {
                if (assigned.length >= 3) break;

                // 2. Criterio de prioridad: de los elegibles, quedarse con los del nivel de interes actual.
                const candidates = eligible.filter(revisor => {
                    const bid = this.bidFor(paper, revisor);
                    return (bid ? bid.interest() : null) === interestLevel;
                });

                // 3. Asignar candidatos hasta completar 3 revisores para este paper.
                for (const reviewer of candidates) {
                    if (assigned.length >= 3) break;
                    assigned.push(reviewer);
                    assignmentCount.set(reviewer, assignmentCount.get(reviewer) + 1);
                    this._assignments.push({ paper, reviewer });
                }
            }
        }
    }

    /** Devuelve los revisores asignados a un paper. */
    assignmentsFor(paper) {
        return this._assignments
            .filter((a) => a.paper === paper)
            .map((a) => a.reviewer);
    }

    /** Registra o actualiza el bid de un revisor para un paper. Solo en etapa Bidding. */
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



    bidExistsFor(paper, reviewer) {
        return this.bidFor(paper, reviewer) !== undefined;
    }

    bidFor(paper, reviewer) {
        return this._bids.find((suspect) => (suspect.paper() == paper) && (suspect.reviewer() == reviewer));
    }

    interestFor(paper, reviewer) {
        return this.bidFor(paper, reviewer).interest();
    }

    /** Assignment → Reviewing. */
    closeAssignment() {
        this.setStage(Stages.Reviewing);
    }

    /**
     * Carga la revision de un revisor asignado. Solo en etapa Reviewing.
     * El puntaje debe estar entre -3 y +3.
     */
    submitReview(paper, reviewer, text, score) {
        if (this.stage() !== Stages.Reviewing)
            throw new Error("Cannot submit reviews from the current stage.");
        if (!this.assignmentsFor(paper).includes(reviewer))
            throw new Error("Reviewer is not assigned to this paper.");
        if (score < -3 || score > 3)
            throw new Error("Score must be between -3 and +3.");
        paper.addReview(reviewer, text, score);
    }

    /** Reviewing → Selection. */
    closeReviewing() {
        this.setStage(Stages.Selection);
    }

    /**
     * Acepta el top N% de papers ordenados por score descendente.
     * @param {number} percentage Porcentaje de aceptacion (0-100).
     */
    selectPapers(percentage) {
        const count = Math.floor(this._papers.length * percentage / 100);
        const sorted = this._papers.slice().sort((a, b) => b.score() - a.score());
        this._acceptedPapers = sorted.slice(0, count);
    }

    acceptedPapers() {
        return this._acceptedPapers;
    }
}

module.exports = Session;