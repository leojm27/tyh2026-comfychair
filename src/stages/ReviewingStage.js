const SessionStage = require("./SessionStage");

/**
 * Clase que representa la etapa de revisión de trabajos de la sesión.
 * En esta etapa, los revisores pueden enviar sus revisiones para los trabajos que se les asignaron.
 * Una vez que se cierra la etapa de revisión, se pasa a la etapa de selección de trabajos.
 */
class ReviewingStage extends SessionStage {
    
    submitReview(session, paper, reviewer, text, score) {
        if (!session.assignmentsFor(paper).includes(reviewer))
            throw new Error("Reviewer is not assigned to this paper.");
        if (score < -3 || score > 3)
            throw new Error("Score must be between -3 and +3.");
        paper.addReview(reviewer, text, score);
    }

    closeReviewing(session) {
        const SelectionStage = require("./SelectionStage");
        session.setStage(new SelectionStage());
    }
}

module.exports = ReviewingStage;
