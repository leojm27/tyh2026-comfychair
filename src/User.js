const crypto = require('crypto');

class User {
    constructor(fullName, affiliation, email, password) {
        const hash = crypto.createHash('sha256');
        this.fullName = fullName;
        this.affiliation = affiliation;
        this.email = email;
        this.encryptedPassword = hash.update(password).digest('base64');
    }

    /**
     * Obtener el nombre completo del usuario.
     * @returns {string} Nombre completo del usuario.
     */
    getFullName() {
        return this.fullName;
    }

    /**
     * Obtener la afiliacion del usuario.
     * @returns {string} Afiliacion del usuario.
     */
    getAffiliation() {
        return this.affiliation;
    }

    /**
     * Obtener correo electrónico del usuario.
     * @returns {string} Correo electrónico del usuario.
     */
    getEmail() {
        return this.email;
    }

    /**
     * Obtener contraseña encriptada del usuario.
     * @returns {string} Contraseña encriptada del usuario.
     */
    getEncryptedPassword() {
        return this.encryptedPassword;
    }
}

module.exports = User;