const Paper = require("./Paper");

/**
 * Clase que representa un poster, que es un tipo de paper que tiene un archivo adjunto y un enlace a los archivos fuente.
 */
class Poster extends Paper {
    constructor(title, authors, correspondingAuthor, attachmentUrl, sourcesUrl) {
        super(title, authors, correspondingAuthor);
        this._attachmentUrl = attachmentUrl;
        this._sourcesUrl = sourcesUrl;
    }

    /**
     * Obtener la URL del archivo adjunto del poster.
     * @returns {string} URL del archivo adjunto.
     */
    attachmentUrl() {
        return this._attachmentUrl;
    }

    /**
     * Obtener la URL de los archivos fuente del poster.
     * @returns {string} URL de los archivos fuente.
     */
    sourcesUrl() {
        return this._sourcesUrl;
    }
}

module.exports = Poster;
