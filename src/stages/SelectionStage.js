const SessionStage = require("./SessionStage");

/**
 * Clase que representa la etapa de selección de trabajos de la sesión.
 * En esta etapa, se seleccionan los trabajos que serán aceptados para la conferencia.
 * La selección se realiza en base a las revisiones y puntuaciones obtenidas durante la etapa de revisión (ReviewingStage).
 */
class SelectionStage extends SessionStage {

    selectPapers(session) {
        if (!session._policy)
            throw new Error("No acceptance policy configured.");
        session._acceptedPapers = session._policy.select(session._papers);
    }
}

module.exports = SelectionStage;
