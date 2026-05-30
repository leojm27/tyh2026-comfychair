const User = require("../src/User");
const crypto = require('crypto');

let juan;

beforeEach(() => {
    juan = new User("Juan Gardey", "LIFIA, UNLP", "juan.gardey@lifia.unlp.edu.ar", "password123");
});

describe("A new User", () => {
    it("should know its full name", () => {
        expect(juan.getFullName()).toBe("Juan Gardey");
    }); 
    it("should know its affiliation", () => {
        expect(juan.getAffiliation()).toBe("LIFIA, UNLP");
    });

    it("should know its email", () => {
        expect(juan.getEmail()).toBe("juan.gardey@lifia.unlp.edu.ar");
    });

    it("should know its password", () => {
        const expected = crypto.createHash('sha256').update("password123").digest('base64');
        expect(juan.getEncryptedPassword()).toBe(expected);
    });
});
