import GameObject from './GameObject'
import Position from '../Position'
import projectilePseudoSprites from '../pseudo-sprites/projectile'
import checkCollisionBetweenGameObjects from '../utils/checkCollisionBetweenGameObjects'
import {
    ORIGINAL_GAME_HEIGHT,
} from '../constants/dimensions'

class Projectile extends GameObject {
    _dy = 0
    _enemyFriendly = false

    constructor (x, y, dy, sprites) {
        super(sprites || projectilePseudoSprites, new Position(x, y))
        this._dy = dy
        this._frameChangeFrequency = 10
    }

    colidesWith (actor) {
        return checkCollisionBetweenGameObjects(actor, this)
    }

    enemyFriendly (status) {
        this._enemyFriendly = status
        return this
    }

    isEnemyFriendly () {
        return this._enemyFriendly
    }

    isProjectile () {
        return true
    }

    move () {
        if (this.isDisposed()) return

        const dx = 0
        const dy = this._dy
        const nextY = this._position.getY() + dy

        if (nextY < 0 || nextY > (ORIGINAL_GAME_HEIGHT - this._width)) {
            this.dispose()

        } else {
            super.move(dx, dy)
        }
    }
}

export default Projectile