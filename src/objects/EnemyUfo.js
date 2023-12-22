import GameObject from './GameObject'
import Position from '../Position'
import Sounds from '../Sounds'
import SIGNALS from '../constants/signals'
import ufoPseudosprites from '../pseudo-sprites/alien-ufo'
import random from '../utils/random'
import { ORIGINAL_GAME_WIDTH } from '../constants/dimensions'

class EnemyUfo extends GameObject {
    static DIRECTION = {
        leftToRight: 1,
        rightToLeft: 2,
    }

    static SPEED = {
        low: 1,
        high: 2,
    }

    _dx = 0
    _points = 0
    _signals = null
    _sounds = null

    constructor (signalBroadcaster, direction, speed) {
        direction = direction || Object.values(EnemyUfo.DIRECTION)[Math.floor(random(2))]
        speed = speed || Object.values(EnemyUfo.SPEED)[Math.floor(random(2))]

        const position = direction === EnemyUfo.DIRECTION.leftToRight
            ? new Position(0, 5)
            : new Position(ORIGINAL_GAME_WIDTH - 10, 5)

        super(ufoPseudosprites, position)

        this._dx = direction === EnemyUfo.DIRECTION.leftToRight
            ? 1
            : -1
        this._points = 1000
        this._signals = signalBroadcaster
        this._sounds = new Sounds()
        this._sounds.playMusic(speed === EnemyUfo.SPEED.high
            ? 'ufo_highpitch'
            : 'ufo_lowpitch', true)
        this._speed = speed === EnemyUfo.SPEED.high
            ? 1.8
            : 0.8
    }

    dispose () {
        this._sounds.dispose()
        super.dispose()
    }

    hitWith (projectile) {
        if (projectile.isEnemyFriendly()) return
        this._signals.broadcast(SIGNALS.score, this._points)
        this._signals.broadcast(SIGNALS.sound, 'invaderkilled')
        projectile.dispose()
        this.dispose()
    }

    isInMotion () {
        return true
    }

    move () {
        const nextX = this._position.getX() + this._dx
        if (nextX < 0 || nextX > ORIGINAL_GAME_WIDTH - 10) {
            return this.dispose()
        }

        super.move(this._dx * this._speed)
    }
}

export default EnemyUfo