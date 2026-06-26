const SessionStage = require("./SessionStage");

/**
 * Clase que representa la etapa de selección de trabajos de la sesión.
 * En esta etapa, se seleccionan los trabajos que serán aceptados para la conferencia.
 * La selección se realiza en base a las revisiones y puntuaciones obtenidas durante la etapa de revisión.
 */
class SelectionStage extends SessionStage {

    selectPapers(session, percentage) {
        const count = Math.floor(session._papers.length * percentage / 100);
        const sorted = session._papers.slice().sort((a, b) => b.score() - a.score());
        session._acceptedPapers = sorted.slice(0, count);
    }
}

module.exports = SelectionStage;
