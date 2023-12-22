import Sounds from '../Sounds'
import DEFAULT_ENEMY_GROUP_MOVEMENT_PATTERN_MIXIN from './mixins/enemyGroupMovementPattern'
import SIGNALS from '../constants/signals'
import getActorCoordinates from '../utils/getGameObjectCoordinates'
import random from '../utils/random'

const LAST_ENEMY_INCREMENT_SPEED = 2

class EnemyGroup {
    _dx = 0
    _dy = 0
    _gameObjects = []
    _isDisposed = false
    _lastX = 0
    _lastY = 0
    _shootInterval
    _signals = null
    _sounds = null
    _speed = 0
    _x = 0
    _y = 0

    constructor (signalBroadcaster, {
        movementPatternMixin = DEFAULT_ENEMY_GROUP_MOVEMENT_PATTERN_MIXIN,
        initialDirection = 1,
        initialSpeed = 0.1,
        initialX = 0,
        initialY = 0,
        shoot = {
            every: 1.5,
            probability: 50,
        }
    } = {}) {

        this._dx = initialDirection
        this._signals = signalBroadcaster
        this._sounds = new Sounds()
        this._speed = initialSpeed
        this._x = initialX
        this._y = initialY

        this._shootInterval = shoot && this.initializeShooting(shoot.every, shoot.probability)
        this._signals.subscribe(SIGNALS.enemyDispatched, this.dispatchActor.bind(this))

        Object.assign(this, movementPatternMixin)
    }

    dispatchActor (actor) {
        const actorPosition = actor.getPosition()
        const x = actorPosition.getX()
        const y = actorPosition.getY()
        const { height, width } = actor.getSize()

        actor.dispose()

        this.increaseSpeed(0.02)
        this._signals.broadcast(SIGNALS.sound, 'invaderkilled')

        if (x <= this._x
         || y <= this._y
         || x + width - 1 >= this._lastX
         || y + height - 1 >= this._lastY) {

            this.resetGroupTotalSize()
        }

        if (this._gameObjects?.length === 1) {
            this._speed += LAST_ENEMY_INCREMENT_SPEED
            this._sounds.playMusic(
                [
                    'fastinvader1',
                    'fastinvader2',
                    'fastinvader3',
                    'fastinvader4',
                ][Math.floor(random(4))], true)
        }
    }

    dispose () {
        clearInterval(this._shootInterval)
        this._sounds.dispose()
        this._signals.clear([SIGNALS.enemyDispatched])
        this._gameObjects.forEach(actor => actor.dispose())
        this._gameObjects = []
        this._isDisposed = true
    }

    draw (canvas) {
        this._gameObjects.forEach(gameObject => gameObject.draw(canvas))
    }

    getActors () {
        return this._gameObjects
    }

    increaseSpeed (speed) {
        this._speed += speed
    }

    initializeShooting (everySecond, probability) {
        return setInterval(() => {
            const shouldIShoot = Math.floor(random(101, 1)) <= probability
            if (!shouldIShoot) return
            const enemyIdx = Math.floor(random(this._gameObjects.length))
            const enemy = this._gameObjects[enemyIdx]
            enemy.shoot()

        }, everySecond * 1000)
    }

    isDisposed () {
        return this._isDisposed
    }

    isInMotion () {
        return true
    }

    isGroup () {
        return true
    }

    move () {
        if (this.isDisposed()) return

        const [dx, dy] = this.movePattern(this)

        this._lastX += dx
        this._lastY += dy
        this._x += dx
        this._y += dy
        for (const actor of this._gameObjects) {
            actor.move(dx, dy)
        }
    }

    pushActor (actor) {
        this._gameObjects.push(actor)
        this.updateGroupSize(actor)
    }

    resetGroupTotalSize () {
        this._gameObjects = this._gameObjects.filter(actor => !actor.isDisposed())

        if (this._gameObjects.length < 1) {
            this.dispose()
            return this._signals.broadcast(SIGNALS.playerWonStage)
        }

        let lastX = 0
        let lastY = 0
        let x = this._lastX
        let y = this._lastY

        for (const actor of this._gameObjects) {
            const [actorX, actorY] = getActorCoordinates(actor)
            if (actorX > lastX) lastX = actorX
            if (actorY > lastY) lastY = actorY
            if (actorX < x) x = actorX
            if (actorY < y) y = actorY
        }

        this._lastX = lastX
        this._lastY = lastY
        this._x = x
        this._y = y
    }

    updateGroupSize (actor) {
        if (actor.isDisposed()) return

        const [actorX, actorY] = getActorCoordinates(actor)
        if (actorX > this._lastX) this._lastX = actorX
        if (actorY > this._lastY) this._lastY = actorY
        if (actorX < this._x) this._x = actorX
        if (actorY < this._y) this._y = actorY
    }
}

export default EnemyGroup