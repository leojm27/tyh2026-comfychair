const Conference = require("../src/Conference");
const Session = require("../src/Session");
const User = require("../src/User");

let conference;
let chair1;
let session1;

beforeEach(() => {
    conference = new Conference("AWS 2026");
    chair1 = new User("Alice Smith", "University of AWS", "alice@aws.com", "1234");
    session1 = new Session();
});

describe("Nueva conferencia", () => {
    it("debería tener un nombre", () => {
        expect(conference.name()).toBe("AWS 2026");
    });

    it("debería empezar sin chairs, y sin sesiones", () => {
        expect(conference.chairs()).toHaveLength(0);
        expect(conference.sessions()).toHaveLength(0);
    });

    it("debería poder agregar un chair", () => {
        conference.addChair(chair1);
        expect(conference.chairs()).toContain(chair1);
        expect(conference.chairs()).toHaveLength(1);
    });

    it("debería poder agregar una sesión", () => {
        conference.addSession(session1);
        expect(conference.sessions()).toContain(session1);
        expect(conference.sessions()).toHaveLength(1);
    });
});

