const Stages = Object.freeze({
    Receiving:  Symbol("Receiving"),
    Bidding:    Symbol("Bidding"),
    Assignment: Symbol("Assignment"),
    Reviewing:  Symbol("Reviewing"),
    Selection:  Symbol("Selection")
});

module.exports = Stages;
