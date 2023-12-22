import GameObject from './GameObject'
import Projectile from './Projectile'
import alienOnePseudoSprites from '../pseudo-sprites/alien-1'
import alienTwoPseudoSprites from '../pseudo-sprites/alien-2'
import alienThreePseudoSprites from '../pseudo-sprites/alien-3'
import alienProjectilePseudoSprites from '../pseudo-sprites/alien-projectile'
import SIGNALS from '../constants/signals'

class Enemy extends GameObject {
    static TYPE = {
        enemyOne: 0,
        enemyTwo: 1,
        enemyThree: 2,
    }

    static factory = function (enemyType, position, signalBroadcaster) {
        switch (enemyType) {
            case Enemy.TYPE.enemyOne:
                return new Enemy(signalBroadcaster, alienOnePseudoSprites, position, 20)
            case Enemy.TYPE.enemyTwo:
                return new Enemy(signalBroadcaster, alienTwoPseudoSprites, position, 30)
            case Enemy.TYPE.enemyThree:
                return new Enemy(signalBroadcaster, alienThreePseudoSprites, position, 50)
            default:
                return Enemy.factory(TYPE.enemyOne, position, signalBroadcaster)
        }
    }

    _points = 0
    _signals = null

    constructor (signalBroadcaster, pseudoSprites, initialPositon, points) {
        super(pseudoSprites, initialPositon)
        this._points = points
        this._signals = signalBroadcaster
    }

    hitWith (projectile) {
        if (projectile.isEnemyFriendly()) return
        this._signals.broadcast(SIGNALS.score, this._points)
        this._signals.broadcast(SIGNALS.enemyDispatched, this)
        projectile.dispose()
    }

    isEnemy () {
        return true
    }

    shoot () {
        if (this.isDisposed()) return
        const projectileX = this._position.getX() + (this._width / 2)
        const projectileY = this._position.getY() + this._height
        const projectileDy = 1
        const projectile = new Projectile(projectileX, projectileY, projectileDy, alienProjectilePseudoSprites)
            .enemyFriendly(true)
        this._signals.broadcast(SIGNALS.projectile, projectile)
        this._signals.broadcast(SIGNALS.sound, 'shoot')
    }
}

export default Enemy