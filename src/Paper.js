const Review = require("./Review");

class Paper {
    constructor(title, authors, correspondingAuthor) {
        if (!authors.includes(correspondingAuthor)) throw new Error("Corresponding author must be an author");
        this._title = title;
        this._reviews = [];
        this._authors = authors;
        this._correspondingAuthor = correspondingAuthor;
    }

    /**
     * Devuelve el título del paper.
     * @returns 
     */
    title() {
        return this._title;
    }

    /**
     * Devuelve los autores del paper.
     * @returns {User[]}
     */
    authors() {
        return this._authors;
    }

    /**
     * Devuelve las revisiones del paper.
     * @returns 
     */
    reviews() {
        return this._reviews;
    }

    /**
     * Devuelve si el paper es válido.
     * @returns {boolean}
     */
    isValid() {
        return (this._title !== "") && (this._authors.length > 0);
    }

    /**
     * Añade una revisión al paper.
     * @param {*} reviewer 
     * @param {*} review 
     * @param {*} score 
     */
    addReview(reviewer, review, score) {
        if (this.reviewsCount() < this.constructor.allowedReviews)
            this._reviews.push(new Review(reviewer, review, score));
        else throw (new Error("Cannot allow any more reviews"))
    }

    /**
     * Devuelve el número de revisiones del paper.
     * @returns {number}
     */
    reviewsCount() {
        return this.reviews().length;
    }


    /**
     * Devuelve la puntuación promedio del paper.
     * @returns {number}
     */
    score() {
        if (this.reviewsCount() > 0) {
            let sum = this.reviews().reduce((partialSum, review) => partialSum + review.score(), 0);
            return sum / this.reviewsCount();
        }
        else
            return 0;
    }
}

Paper.allowedReviews = 3;

module.exports = Paper;