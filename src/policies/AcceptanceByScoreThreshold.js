const AcceptancePolicy = require("./AcceptancePolicy");

/**
 * Clase que representa una política de aceptación de trabajos basada en un umbral de puntuación.
 * Esta política selecciona los trabajos que tienen una puntuación igual o superior al umbral especificado.
 * La selección se realiza en base a las revisiones y puntuaciones obtenidas durante la etapa de revisión (ReviewingStage).
 */
class AcceptanceByScoreThreshold extends AcceptancePolicy {

    constructor(minScore) {
        super();
        this._minScore = minScore;
    }

    select(papers) {
        return papers.filter(paper => paper.score() >= this._minScore);
    }
}

module.exports = AcceptanceByScoreThreshold;
