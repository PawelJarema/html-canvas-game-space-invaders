import GameObject from './GameObject'
import Projectile from './Projectile'
import Position from '../Position'
import playerPseudoSprites from '../pseudo-sprites/player'
import SIGNALS from '../constants/signals'
import {
    ORIGINAL_GAME_HEIGHT,
    ORIGINAL_GAME_WIDTH,
} from '../constants/dimensions'

const CANON_RELOAD_TIME = 500
const INVUNERABILITY_AFTER_HIT_TIME = 5000

class Player extends GameObject {
    _blinking = false
    _blinkingFrame = 0
    _blinkingFrequency = 15
    _blinkingSprite = null
    _blinkingTick = 0
    _lives = 3
    _loaded = true
    _signals = null

    constructor (signalBroadcaster) {
        super(playerPseudoSprites, new Position(0, ORIGINAL_GAME_HEIGHT - 8))
        this._isInMotion = false // <- object controlled by player input
        this._signals = signalBroadcaster
        signalBroadcaster.subscribe(SIGNALS.leftKeyPressed, () => this.move(-1))
        signalBroadcaster.subscribe(SIGNALS.rightKeyPressed, () => this.move(1))
        signalBroadcaster.subscribe(SIGNALS.fireKeyPressed, this.shoot.bind(this))
    }

    addLife () {
        this._lives += 1
    }

    becomeInvunerable (timeoutInSec) {
        this._blinking = true
        setTimeout(() => { this._blinking = false }, timeoutInSec)
    }

    canShoot () {
        return this._loaded
    }

    dispose () {
        if (this._projectile) this._projectile.dispose()
        this._signals.clear([
            SIGNALS.leftKeyPressed,
            SIGNALS.rightKeyPressed,
            SIGNALS.fireKeyPressed,
        ])
        delete this._blinkingSprite
        super.dispose()
    }

    getLivesDetails () {
        return [this._lives, this._sprites[0]]
    }

    getSprite () {
        const sprite = super.getSprite()

        if (this._blinking) {
            this._blinkingTick = (this._blinkingTick + 1) % this._blinkingFrequency
            if (this._blinkingTick === 0) this._blinkingFrame = this._blinkingFrame ? 0 : 1
            if (this._blinkingFrame === 0) {
                this._blinkingSprite = this._blinkingSprite || sprite.map(row => row.map(_ => ' '))
                return this._blinkingSprite
            }
        }

        return sprite
    }

    hitWith (projectile) {
        if (this.isInvunerable()) return

        this._lives -= 1
        this._signals.broadcast(SIGNALS.sound, 'explosion')

        if (this._lives < 0) {
            return this._signals.broadcast(SIGNALS.gameOver)

        } else {
            this.becomeInvunerable(INVUNERABILITY_AFTER_HIT_TIME)
        }

        projectile.dispose()
    }

    isInvunerable () {
        return this._blinking
    }

    isPlayer () {
        return true
    }

    move (dx) {
        const nextX = this._position.getX() + dx
        if (nextX >= 0 && nextX <= ORIGINAL_GAME_WIDTH - this._width) {
            super.move(dx)
        }
    }

    reload () {
        if (this.canShoot()) return
        this._loaded = true
    }

    shoot () {
        if (!this.canShoot()) return
        const projectileX = this._position.getX() + (this._width / 2)
        const projectileY = this._position.getY() - 4 // <- projectile sprite height
        const projectileDy = -1
        const projectile = new Projectile(projectileX, projectileY, projectileDy)
        this._signals.broadcast(SIGNALS.projectile, projectile)
        this._signals.broadcast(SIGNALS.sound, 'shoot')

        this._loaded = false
        setTimeout(this.reload.bind(this), CANON_RELOAD_TIME)
    }
}

export default Player