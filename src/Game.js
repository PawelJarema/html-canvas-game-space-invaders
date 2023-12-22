import Canvas from './Canvas'
import Counter from './Counter'
import Enemy from './objects/Enemy'
import GameWorld from './GameWorld'
import EnemyGroup from './objects/EnemyGroup'
import KeyboardInput from './KeyboardInput'
import LevelScreen from './LevelScreen'
import MoundGroup from './objects/MoundGroup'
import Player from './objects/Player'
import Position from './Position'
import SignalBroadcaster from './SignalBroadcaster'
import Sounds from './Sounds'
import TitleScreen from './TitleScreen'
import SIGNALS from './constants/signals'
import random from './utils/random'
import { ORIGINAL_GAME_WIDTH } from './constants/dimensions'
import EnemyUfo from './objects/EnemyUfo'

const SCORE_STORAGE_KEY = 'js-space-invaders-score'

class Game {
    _canvas
    _gameWorld
    _hiScore
    _inProgress
    _keyboard
    _lastFrame
    _music
    _player
    _playerLastBonus
    _score
    _settings
    _signals
    _sound
    _stage
    _startTime
    _titleScreen
    _ufoTimeout

    constructor (settings) {
        this._signals = new SignalBroadcaster()
        this._settings = settings || this._settings
        this._keyboard = new KeyboardInput()
        this._canvas = new Canvas(this._settings.canvasId)

        const hiScore = localStorage.getItem(SCORE_STORAGE_KEY)
        this._hiScore = new Counter(hiScore ? parseInt(hiScore) : 100)

        this._keyboard.bind(['a','A','ArrowLeft'], () => this._signals.broadcast(SIGNALS.leftKeyPressed))
        this._keyboard.bind(['d','D','ArrowRight'], () => this._signals.broadcast(SIGNALS.rightKeyPressed))
        this._keyboard.bind([' ','Enter'], () => this._signals.broadcast(SIGNALS.fireKeyPressed))

        this._signals.subscribe(SIGNALS.score, this.score.bind(this))
        this._signals.subscribe(SIGNALS.sound, this.sound.bind(this))
        this._signals.subscribe(SIGNALS.gameOver, this.end.bind(this))
        this._signals.subscribe(SIGNALS.playerWonStage, this.nextStage.bind(this))

        this._titleScreen = new TitleScreen(this)
    }

    end () {
        this._inProgress = false
        
        clearTimeout(this._ufoTimeout)
    
        this._gameWorld.dispose()
        this._music.playMusic('gameover')
        this._titleScreen.darken()

        const score = this._score.getScore()
        const hiScore = this._hiScore.getScore()

        if (score > hiScore) {
            this._hiScore.reset(score)
            localStorage.setItem(SCORE_STORAGE_KEY, score)
        }
    }

    nextStage () {
        this._stage.addScore(1)
        this.stage(this._stage.getScore())
    }

    randomlySpawnNextUfo () {
        const nextUfoInMin = random(2.5, 0.3)
        this._ufoTimeout = setTimeout(() => {
            this._gameWorld.pushActor(new EnemyUfo(this._signals))
            this.randomlySpawnNextUfo()
        }, nextUfoInMin * 60000)
    }

    requestNextTick () {
        requestAnimationFrame(this.tick.bind(this))
    }

    score (score) {
        this._score.addScore(score)
        const currentScore = this._score.getScore()
        if ((currentScore - this._playerLastBonus) * 0.0001 >= 1) {
            this._player.addLife()
            this._playerLastBonus = currentScore
        }
    }

    sound (name) {
        this._sound.playSound(name)
    }

    stage (stage) {
        this._inProgress = false

        clearTimeout(this._ufoTimeout)

        stage = stage || this._stage.getScore()

        const maxEnemies = Math.floor(ORIGINAL_GAME_WIDTH / 14) - 5
        const enemyCount = Math.min(3 + stage, maxEnemies)
        const enemyExtraRows = Math.floor(stage / 12)
        const enemyGroup = new EnemyGroup(this._signals, {
            initialSpeed: stage * 0.1,
            shoot: {
                every: 1.5 + stage * 0.1,
                probability: 50 + stage * 2,
            },
        })
        
        for (let i = 0; i < enemyCount; i++) {
            enemyGroup.pushActor(Enemy.factory(Enemy.TYPE.enemyThree, new Position(i * 14, 12), this._signals))
            enemyGroup.pushActor(Enemy.factory(Enemy.TYPE.enemyTwo, new Position(i * 14, 12 + 10), this._signals))
            enemyGroup.pushActor(Enemy.factory(Enemy.TYPE.enemyOne, new Position(i * 14, 12 + 10 * 2), this._signals))
            enemyGroup.pushActor(Enemy.factory(Enemy.TYPE.enemyOne, new Position(i * 14, 12 + 10 * 3), this._signals))
            for (let j = 0; j < enemyExtraRows; j++) {
                enemyGroup.pushActor(Enemy.factory(Enemy.TYPE.enemyOne, new Position(i * 14, 12 + 10 * (4 + j)), this._signals))
            }
        }
        
        this._gameWorld.pushActor(enemyGroup)

        new LevelScreen({
            callback: () => {
                this._inProgress = true
                this.requestNextTick()
            },
            durationSec: 1,
            text: `STAGE ${stage}`,
        })

        this.randomlySpawnNextUfo()
    }

    start () {
        this._titleScreen.hide()

        this._inProgress = true
        this._player = new Player(this._signals)
        this._gameWorld = new GameWorld(this._signals)
        this._gameWorld.pushActor(this._player)

        const moundGroup = new MoundGroup(this._signals)
        this._gameWorld.pushActor(moundGroup.populate(4))

        this._music = new Sounds('.mp3')
        this._music.playMusicList(['music'])
        this._score = new Counter(0)
        this._sound = new Sounds('.wav')
        this._stage = new Counter(1)

        this.stage(this._stage.getScore())

        this.requestNextTick()
    }

    tick (time) {
        if (!this._inProgress) return

        if (this._startTime === undefined) {
            this._startTime = time
        }

        const deltaTime = time - this._startTime
        const currentFrame = Math.round(deltaTime / (1000 / this._settings.fps)) % this._settings.fps

        if (currentFrame !== this._lastFrame) {
            this._canvas.clear()
            this._canvas.drawScore(this._stage.getScore(), this._hiScore.getScore(), this._score.getScore())
            this._canvas.drawLives(this._player.getLivesDetails())
            this._gameWorld.moveActors()
            this._gameWorld.drawActors(this._canvas)
            this._gameWorld.handleColisions()
            this._gameWorld.removeDispatchedActors()
            this._keyboard.reiteratePressed()
            this._lastFrame = currentFrame
        }

        this.requestNextTick()
    }
}

export default Game