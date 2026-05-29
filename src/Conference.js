/**
 * Clase que representa una conferencia.
 * Contiene el nombre de la conferencia, los chairs y las sesiones.
 */
class Conference {
    constructor(name) {
        this._name = name;
        this._chairs = [];
        this._sessions = [];
    }

    /**
     * Devuelve el nombre de la conferencia.
     */
    name() {
        return this._name;
    }
    /**
     * Devuelve los chairs de la conferencia.
     */
    chairs() {
        return this._chairs;
    }

    /**
     * Devuelve las sesiones de la conferencia.
     */
    sessions() {
        return this._sessions;
    }

    /**
     * Añade un chair a la conferencia.
     */
    addChair(user) {
        this._chairs.push(user);
    }

    /**
     * Añade una sesión a la conferencia.
     */
    addSession(session) {
        this._sessions.push(session);
    }
}

module.exports = Conference;
