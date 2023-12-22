import Position from '../Position'

class GameObjectBaseClass {
    _height = 0
    _frame = 0
    _frameChangeFrequency = 40
    _frameTick = 0
    _isDisposed = false
    _isInMotion = true
    _position = null
    _sprites = null
    _width = 0

    constructor (pseudoSprites, initialPosition) {
        this._height = pseudoSprites[0].length
        this._position = initialPosition || new Position(0, 0)
        this._sprites = pseudoSprites
        this._width = pseudoSprites[0][0].length
    }

    dispose () {
        delete this._animationFrequency
        delete this._animationTicks
        delete this._blinkingSprite
        delete this._nextSpriteIdx
        delete this._position
        delete this._sprites

        this._isDisposed = true
    }

    draw (canvas) {
        canvas.drawGameObject(this)
    }

    move (dx = 0, dy = 0) {
        if (this.isDisposed()) return

        const newX = this._position.getX() + dx
        const newY = this._position.getY() + dy
        this._position = new Position(newX, newY)
        this.nextAninmationFrame()
    }

    nextAninmationFrame () {
        this._frameTick = (this._frameTick + 1) % this._frameChangeFrequency
        if (this._frameTick === 0) {
            this._frame = (this._frame + 1) % this._sprites.length
        }
    }

    getPosition () {
        return this._position
    }

    getSize () {
        return { height: this._height, width: this._width }
    }

    getSprite () {
        return this._sprites[this._frame]
    }

    isDisposed () {
        return this._isDisposed
    }

    isDrawable () {
        return !this._isDisposed
    }

    isInMotion () {
        return this._isInMotion
    }

    setBlinking (blinking) {
        this._blinking = blinking
    }
}

export default GameObjectBaseClass