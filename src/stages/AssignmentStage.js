const SessionStage = require("./SessionStage");

class AssignmentStage extends SessionStage {

    closeAssignment(session) {
        const ReviewingStage = require("./ReviewingStage");
        session.setStage(new ReviewingStage());
    }
}

module.exports = AssignmentStage;
