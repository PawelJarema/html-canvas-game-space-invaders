import Mound from './Mound'
import Position from '../Position'
import {
    ORIGINAL_GAME_HEIGHT,
    ORIGINAL_GAME_WIDTH,
} from '../constants/dimensions'

class MoundGroup {
    _isDisposed = false
    _mounds = []
    _signals = null

    constructor (signalBroadcaster) {
        this._signals = signalBroadcaster
    }

    dispose () {
        this._isDisposed = true
        this._mounds.forEach(mound => mound.dispose())
    }

    draw (canvas) {
        this._mounds.forEach(gameObject => gameObject.draw(canvas))
    }

    getActors () {
        return this._mounds
    }

    isDisposed () {
        return this._isDisposed
    }

    isGroup () {
        return true
    }

    isInMotion () {
        return false
    }

    populate () {
        const moundCount = 4
        const moundHeight = 16
        const moundWidth = 30
        const moundSpacing = Math.floor((ORIGINAL_GAME_WIDTH - moundWidth * moundCount) / (moundCount + 1))
        const moundY = ORIGINAL_GAME_HEIGHT - moundHeight - (4 * 4) // <- four times player height

        let moundX = moundSpacing
        for (let i = 0; i < moundCount; i++) {
            this.pushActor(new Mound(new Position(moundX, moundY)))
            moundX += moundWidth + moundSpacing
        }

        return this
    }

    pushActor (actor) {
        this._mounds.push(actor)
    }
}

export default MoundGroup