const Session = require("../src/Session");
const Stages = require("../src/constants/Stages");
const User = require("../src/User");
const Paper = require("../src/Paper");
const Bid = require("../src/Bid");
const Interests = require("../src/constants/Interests");
const AcceptanceByCount = require("../src/policies/AcceptanceByCount");
const AcceptanceByScoreThreshold = require("../src/policies/AcceptanceByScoreThreshold");

let newSession;
let asse;
let juan, julian, matias;
let paper01, paper02, paper03;

beforeEach(() => {
    newSession = new Session();
    asse = new Session();
    juan = new User("Juan Gardey", "LIFIA, UNLP", "jgardey@lifia.ar", "123");
    julian = new User("Julián Grigera", "LIFIA, UNLP", "jgrigera@lifia.ar", "123");
    matias = new User("Matias Urbieta", "LIFIA, UNLP", "murbieta@lifia.ar", "123");
    paper01 = new Paper("A new approach on something", [juan, julian], juan);
    paper02 = new Paper("Another approach on something else", [matias, julian], matias);
    paper03 = new Paper("Yet another approach on something", [juan, matias], juan);
});

describe("A new Session", () => {
    it("should have an empty name", () => {
        expect(newSession.name()).toBe("");
    })

    it("should have an empty Program Committee", () => {
        expect(newSession.programCommittee()).toHaveLength(0);
    })
})

describe("A Session", () => {
    it("should be able to add PC members.", () => {
        asse.addReviewer(juan);
        expect(asse.reviewers()).toContain(juan);
        expect(asse.reviewers()).toHaveLength(1);
    })
    it("should allow paper submissions", () => {
        expect(asse.canSubmit(paper01)).toBe(true);
        asse.submit(paper01);
        expect(asse.papers()).toContain(paper01);
    })
})

describe("During the bidding process, a Session", () => {
    it("should receive bids", () => {
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        expect(asse.bidExistsFor(paper02, juan)).toBe(true);
        expect(asse.interestFor(paper02, juan)).toBe(Interests.Interested);
    })
    it("should allow overriding bids", () => {
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        const secondBid = () => { asse.enterBid(paper02, juan, Interests.Maybe) };
        expect(secondBid).not.toThrow();
        expect(asse.interestFor(paper02, juan)).toBe(Interests.Maybe);
        expect(asse.bids()).toHaveLength(1);
    })
    it("should not allow to receive submissions", () => {
        asse.closeSubmissions();
        expect(asse.canSubmit(paper01)).toBe(false);
    })
    it("should fail to receive submissions", () => {
        asse.closeSubmissions();
        let submission = () => { asse.submit(paper01) };
        expect(submission).toThrow();
    })
})

describe("A Session in Receiving stage", () => {
    it("allows updating a paper if it remains valid", () => {
        asse.submit(paper01);
        expect(() => asse.updatePaper(paper01, p => p.setTitle("Updated title"))).not.toThrow();
        expect(paper01.title()).toBe("Updated title");
    });

    it("does not allow updating a paper if it becomes invalid", () => {
        asse.submit(paper01);
        expect(() => asse.updatePaper(paper01, p => p.setTitle(""))).toThrow();
    });

    it("Error -> aper was not submitted to this session.", () => {
        expect(() => asse.updatePaper(paper01, p => p.setTitle("Updated title"))).toThrow();
    });
});

describe("A Session outside of Receiving stage", () => {
    it("does not allow updating papers", () => {
        asse.submit(paper01);
        asse.closeSubmissions();
        expect(() => asse.updatePaper(paper01, p => p.setTitle("Updated title"))).toThrow();
        expect(paper01.title()).toBe("A new approach on something");
    });
});

describe("Error -> Cannot enter bids from the current stage.", () => {
    it("should not allow entering bids in Receiving stage", () => {
        expect(() => asse.enterBid(paper01, juan, Interests.Interested)).toThrow();
    });
});

describe("submitReview() method", () => {
    it("should allow submitting reviews in Reviewing stage", () => {
        asse.addReviewer(juan);
        asse.submit(paper02);
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        asse.closeBidding();
        asse.closeAssignment();
        expect(() => asse.submitReview(paper02, juan, "Great paper!", 2)).not.toThrow();
    });

    it("should not allow submitting reviews outside of Reviewing stage", () => {
        asse.submit(paper01);
        expect(() => asse.submitReview(paper01, juan, "Great paper!", 2)).toThrow();
    });
});

describe("Test _autoAssignReviewers method", () => {
    let rev1, rev2, rev3;

    beforeEach(() => {
        rev1 = new User("Reviewer One",   "LIFIA, UNLP", "rev1@lifia.ar", "123");
        rev2 = new User("Reviewer Two",   "LIFIA, UNLP", "rev2@lifia.ar", "123");
        rev3 = new User("Reviewer Three", "LIFIA, UNLP", "rev3@lifia.ar", "123");
        asse.addReviewer(rev1);
        asse.addReviewer(rev2);
        asse.addReviewer(rev3);
    });

    it("assigns 3 reviewers per paper in order: Interested > Maybe > NotInterested", () => {
        asse.submit(paper01);
        asse.submit(paper02);
        asse.submit(paper03);
        asse.closeSubmissions();

        asse.enterBid(paper01, rev1, Interests.Interested);
        asse.enterBid(paper01, rev2, Interests.Maybe);
        asse.enterBid(paper01, rev3, Interests.NotInterested);

        asse.enterBid(paper02, rev1, Interests.Maybe);
        asse.enterBid(paper02, rev2, Interests.Interested);
        asse.enterBid(paper02, rev3, Interests.NotInterested);

        asse.enterBid(paper03, rev1, Interests.NotInterested);
        asse.enterBid(paper03, rev2, Interests.Maybe);
        asse.enterBid(paper03, rev3, Interests.Interested);

        asse.closeBidding();

        expect(asse.assignmentsFor(paper01)).toEqual([rev1, rev2, rev3]);
        expect(asse.assignmentsFor(paper02)).toEqual([rev2, rev1, rev3]);
        expect(asse.assignmentsFor(paper03)).toEqual([rev3, rev2, rev1]);
    });
});

describe("Stage restrictions - operations not allowed outside their stage", () => {
    it("does not allow closeBidding in Receiving stage", () => {
        expect(() => asse.closeBidding()).toThrow("Operation not allowed in current stage.");
    });

    it("does not allow closeAssignment in Receiving stage", () => {
        expect(() => asse.closeAssignment()).toThrow("Operation not allowed in current stage.");
    });

    it("does not allow closeReviewing in Receiving stage", () => {
        expect(() => asse.closeReviewing()).toThrow("Operation not allowed in current stage.");
    });

    it("does not allow selectPapers in Receiving stage", () => {
        expect(() => asse.selectPapers(50)).toThrow("Operation not allowed in current stage.");
    });

    it("does not allow closeSubmissions once already in Bidding stage", () => {
        asse.closeSubmissions();
        expect(() => asse.closeSubmissions()).toThrow("Operation not allowed in current stage.");
    });
});

describe("ReviewingStage validations", () => {
    beforeEach(() => {
        asse.addReviewer(juan);
        asse.submit(paper02);
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        asse.closeBidding();
        asse.closeAssignment();
    });

    it("does not allow reviewing by a non-assigned reviewer", () => {
        expect(() => asse.submitReview(paper02, julian, "Text", 1))
            .toThrow("Reviewer is not assigned to this paper.");
    });

    it("does not allow a score below -3", () => {
        expect(() => asse.submitReview(paper02, juan, "Text", -4))
            .toThrow("Score must be between -3 and +3.");
    });

    it("does not allow a score above +3", () => {
        expect(() => asse.submitReview(paper02, juan, "Text", 4))
            .toThrow("Score must be between -3 and +3.");
    });

    it("transitions to SelectionStage after closeReviewing", () => {
        const SelectionStage = require("../src/stages/SelectionStage");
        asse.closeReviewing();
        expect(asse.stage()).toBeInstanceOf(SelectionStage);
    });
});

describe("Session selectPapers with acceptance policies", () => {
    let rev, p1, p2;

    beforeEach(() => {
        rev = new User("Rev", "Uni", "rev@uni.ar", "123");
        p1  = new Paper("Paper high score", [juan], juan);
        p2  = new Paper("Paper low score",  [matias], matias);

        asse.addReviewer(rev);
        asse.submit(p1);
        asse.submit(p2);
        asse.closeSubmissions();
        asse.enterBid(p1, rev, Interests.Interested);
        asse.enterBid(p2, rev, Interests.Interested);
        asse.closeBidding();
        asse.closeAssignment();
        asse.submitReview(p1, rev, "Excellent work", 3);
        asse.submitReview(p2, rev, "Needs improvement", 1);
        asse.closeReviewing();
    });

    it("throws if no policy is configured", () => {
        expect(() => asse.selectPapers()).toThrow("No acceptance policy configured.");
    });

    it("accepts top N papers with AcceptanceByCount", () => {
        asse.setPolicy(new AcceptanceByCount(1));
        asse.selectPapers();
        expect(asse.acceptedPapers()).toContain(p1);
        expect(asse.acceptedPapers()).not.toContain(p2);
    });

    it("accepts papers above threshold with AcceptanceByScoreThreshold", () => {
        asse.setPolicy(new AcceptanceByScoreThreshold(2));
        asse.selectPapers();
        expect(asse.acceptedPapers()).toContain(p1);
        expect(asse.acceptedPapers()).not.toContain(p2);
    });

    it("setPolicy() can change the policy before selection", () => {
        asse.setPolicy(new AcceptanceByCount(0));
        asse.setPolicy(new AcceptanceByScoreThreshold(2));
        asse.selectPapers();
        expect(asse.acceptedPapers()).toHaveLength(1);
        expect(asse.acceptedPapers()).toContain(p1);
    });
});