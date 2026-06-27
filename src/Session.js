const Interests = require("./constants/Interests");
const ReceivingStage = require("./stages/ReceivingStage");

class Session {
    constructor(name = "") {
        this._name = name;
        this._programCommittee = [];
        this._papers = [];
        this._bids = [];
        this._acceptedPapers = [];
        this._stage = new ReceivingStage();
        this._policy = null;
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
        return this._stage.canSubmit(paper);
    }

    /** Envia un paper a la sesion. Lanza error si no es valido o la etapa no es Receiving. */
    submit(paper) {
        this._stage.submit(this, paper);
    }

    /** Valida las condiciones, aplica el cambio via updater y verifica que el paper siga siendo valido. */
    updatePaper(paper, updater) {
        this._stage.updatePaper(this, paper, updater);
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
        this._stage.closeSubmissions(this);
    }

    /** Bidding → Assignment. Dispara la asignacion automatica de revisores. */
    closeBidding() {
        this._stage.closeBidding(this);
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
                    paper.assignReviewer(reviewer);
                }
            }
        }
    }

    /** Devuelve los revisores asignados a un paper. */
    assignmentsFor(paper) {
        return paper.assignedReviewers();
    }

    /** Registra o actualiza el bid de un revisor para un paper. Solo en etapa Bidding. */
    enterBid(paper, reviewer, interest) {
        this._stage.enterBid(this, paper, reviewer, interest);
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
        this._stage.closeAssignment(this);
    }

    /** Carga la revision de un revisor asignado. Solo en etapa Reviewing. */
    submitReview(paper, reviewer, text, score) {
        this._stage.submitReview(this, paper, reviewer, text, score);
    }

    /** Reviewing → Selection. */
    closeReviewing() {
        this._stage.closeReviewing(this);
    }

    /** Configura la politica de seleccion de papers aceptados. */
    setPolicy(policy) {
        this._policy = policy;
    }

    /** Selecciona los papers aceptados segun la politica configurada. */
    selectPapers() {
        this._stage.selectPapers(this);
    }

    acceptedPapers() {
        return this._acceptedPapers;
    }
}

module.exports = Session;