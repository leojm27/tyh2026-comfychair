const AcceptancePolicy = require("./AcceptancePolicy");

/**
 * Clase que representa una política de aceptación de trabajos basada en la cantidad de trabajos a aceptar.
 * Esta política selecciona los trabajos con las puntuaciones más altas hasta alcanzar la cantidad especificada.
 * La selección se realiza en base a las revisiones y puntuaciones obtenidas durante la etapa de revisión (ReviewingStage).
 */
class AcceptanceByCount extends AcceptancePolicy {

    constructor(count) {
        super();
        this._count = count;
    }

    select(papers) {
        const sorted = papers.slice().sort((a, b) => b.score() - a.score());
        return sorted.slice(0, this._count);
    }
}

module.exports = AcceptanceByCount;
