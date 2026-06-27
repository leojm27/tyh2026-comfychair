
/**
 * Clase abstracta que representa una política de aceptación de trabajos.
 * Cada política define sus propios criterios para seleccionar los trabajos que serán aceptados.
 * Las políticas concretas deben implementar el método select().
 */
class AcceptancePolicy {

    select(papers) {
        throw new Error("select() must be implemented by a concrete policy.");
    }
}

module.exports = AcceptancePolicy;
