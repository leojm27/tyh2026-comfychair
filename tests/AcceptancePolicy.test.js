const AcceptanceByCount = require("../src/policies/AcceptanceByCount");
const AcceptanceByScoreThreshold = require("../src/policies/AcceptanceByScoreThreshold");
const Paper = require("../src/Paper");
const User = require("../src/User");

let paperHigh, paperMid, paperLow, reviewer;

beforeEach(() => {
    reviewer = new User("Reviewer", "Uni", "rev@uni.ar", "123");
    paperHigh = new Paper("High score paper", [reviewer], reviewer);
    paperMid  = new Paper("Mid score paper",  [reviewer], reviewer);
    paperLow  = new Paper("Low score paper",  [reviewer], reviewer);

    paperHigh.addReview(reviewer, "Excellent", 3);
    paperMid.addReview(reviewer,  "Good",      2);
    paperLow.addReview(reviewer,  "Weak",      1);
});

describe("AcceptanceByCount", () => {
    it("accepts the top N papers ordered by score desc", () => {
        const policy = new AcceptanceByCount(2);
        const accepted = policy.select([paperHigh, paperMid, paperLow]);
        expect(accepted).toContain(paperHigh);
        expect(accepted).toContain(paperMid);
        expect(accepted).not.toContain(paperLow);
    });

    it("accepts no papers when count is 0", () => {
        const policy = new AcceptanceByCount(0);
        expect(policy.select([paperHigh, paperMid, paperLow])).toHaveLength(0);
    });

    it("accepts all papers when count exceeds total", () => {
        const policy = new AcceptanceByCount(10);
        expect(policy.select([paperHigh, paperMid, paperLow])).toHaveLength(3);
    });
});

describe("AcceptanceByScoreThreshold", () => {
    it("accepts all papers with score >= threshold", () => {
        const policy = new AcceptanceByScoreThreshold(2);
        const accepted = policy.select([paperHigh, paperMid, paperLow]);
        expect(accepted).toContain(paperHigh);
        expect(accepted).toContain(paperMid);
        expect(accepted).not.toContain(paperLow);
    });

    it("accepts no papers when none meet the threshold", () => {
        const policy = new AcceptanceByScoreThreshold(5);
        expect(policy.select([paperHigh, paperMid, paperLow])).toHaveLength(0);
    });

    it("accepts all papers when all meet the threshold", () => {
        const policy = new AcceptanceByScoreThreshold(1);
        expect(policy.select([paperHigh, paperMid, paperLow])).toHaveLength(3);
    });
});
