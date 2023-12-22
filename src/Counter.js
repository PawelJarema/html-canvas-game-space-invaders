class Counter {
    _score = 0

    constructor (initialScore = 0) {
        this._score = initialScore
    }

    addScore (score) {
        this._score += score
    }

    getScore () {
        return this._score
    }

    reset (to) {
        this._score = to || 0
    }
}

export default Counter