const SessionStage = require("./SessionStage");

/**
 * Clase que representa la etapa de asignación de revisores de la sesión.
 * En esta etapa, se asignan los revisores a los trabajos que se enviaron durante la etapa de recepción.
 * Una vez que se cierra la etapa de asignación, se pasa a la etapa de revisión de trabajos (ReviewingStage).
 */
class AssignmentStage extends SessionStage {

    closeAssignment(session) {
        const ReviewingStage = require("./ReviewingStage");
        session.setStage(new ReviewingStage());
    }
}

module.exports = AssignmentStage;
