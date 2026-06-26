const SessionStage = require("./SessionStage");
const Bid = require("../Bid");

/**
 * Clase que representa la etapa de licitación de la sesión.
 * En esta etapa, los revisores pueden expresar su interés en revisar ciertos trabajos.
 * Una vez que se cierra la etapa de licitación, se pasa a la etapa de asignación de revisores.
 */
class BiddingStage extends SessionStage {

    enterBid(session, paper, reviewer, interest) {
        if (session.bidExistsFor(paper, reviewer)) {
            session.bidFor(paper, reviewer).setInterest(interest);
        } else {
            session._bids.push(new Bid(paper, reviewer, interest));
        }
    }

    closeBidding(session) {
        const AssignmentStage = require("./AssignmentStage");
        session.setStage(new AssignmentStage());
        session._autoAssignReviewers();
    }
}

module.exports = BiddingStage;
