const Review = require("../src/Review");
const User = require("../src/User");

let leo, joaquin;

beforeEach(() => {
    leo    = new User("Leo Messi",       "PSG",   "leo@psg.com",       "1234");
    joaquin = new User("Joaquin Correa", "Inter", "joaquin@inter.com", "5678");
});

describe("Nueva revisión", () => {
    it("debería conocer su revisor, texto y puntaje", () => {
        const review = new Review(leo, "Great paper!", 2);
        expect(review.reviewer()).toBe(leo);
        expect(review.text()).toBe("Great paper!");
        expect(review.score()).toBe(2);
    });

});

