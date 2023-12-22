import spreadOutVariousGameObjects from './utils/spreadOutVariousGameObjects'
import SIGNALS from './constants/signals'
import random from './utils/random'

class GameWorld {
    _gameObjects = []
    _signals = null

    constructor (signalBroadcaster) {
        this._signals = signalBroadcaster
        this._signals.subscribe(SIGNALS.projectile, this.pushActor.bind(this))
    }

    dispose () {
        this._gameObjects.forEach(actor => actor.dispose())
        this._signals.clear([SIGNALS.projectile])
        this._gameObjects = []
    }

    drawActors (canvas) {
        for (const gameObject of this._gameObjects) {
            gameObject.draw(canvas)
        }
    }

    getActors () {
        return this._gameObjects
    }

    handleColisions () {
        const [actors, projectiles] = spreadOutVariousGameObjects(this._gameObjects)
        for (const projectile of projectiles) {
            for (const actor of actors) {
                if (projectile.colidesWith(actor)) {
                    actor.hitWith(projectile)
                }
            }

            for (const anotherProjectile of projectiles) {
                if (anotherProjectile !== projectile
                 && anotherProjectile.colidesWith(projectile)) {
                    const chanceBothProjectilesAreDisposed = random(101, 1) >= 35
                    if (chanceBothProjectilesAreDisposed) [projectile, anotherProjectile].forEach(projectile => projectile.dispose())
                    else if (projectile.isEnemyFriendly()) anotherProjectile.dispose()
                    else if (anotherProjectile.isEnemyFriendly()) projectile.dispose()
                }
            }
        }
    }

    moveActors () {
        for (const gameObject of this._gameObjects) {
            if (gameObject.isInMotion()) gameObject.move()
        }
    }

    pushActor (gameObject) {
        this._gameObjects.push(gameObject)
    }

    removeActor (gameObject) {
        this._gameObjects = this._gameObjects.filter(actor => actor !== gameObject)
    }

    removeDispatchedActors () {
        for (const gameObject of this._gameObjects) {
            if (gameObject.isDisposed()) {
                this.removeActor(gameObject)
            }
        }
    }
}

export default GameWorld