import clampPosition from './utils/clampPosition'
import COLORS from './constants/colors'
import {
    ORIGINAL_GAME_HEIGHT,
    ORIGINAL_GAME_WIDTH,
} from './constants/dimensions'


class Canvas {
    _canvas = null
    _height = 0
    _pixelSize = 0
    _width = 0

    _getContext () {
        return this._canvas.getContext("2d")
    }

    constructor (id) {
        this._canvas = document.getElementById(id)
        window.addEventListener('resize', this.resize.bind(this))
        this.resize()
    }

    clear () {
        const ctx = this._getContext()
        ctx.clearRect(0, 0, this._width, this._height)
    }

    dispose () {
        window.removeEventListener('resize', this.resize.bind(this))
    }

    drawGameObject (gameObject) {
        if (!gameObject.isDrawable()) return

        const sprite = gameObject.getSprite()
        const position = gameObject.getPosition()
        const x = position.getX()
        const y = position.getY()
        const ctx = this._getContext()

        for (let row = 0; row < gameObject._height; row++) {
            for (let col = 0; col < gameObject._width; col++) {
                const char = sprite[row][col]
                if (char === ' ') continue

                const pixelX = this._pixelSize * clampPosition((x + col), ORIGINAL_GAME_WIDTH)
                const pixelY = this._pixelSize * clampPosition((y + row), ORIGINAL_GAME_HEIGHT)

                ctx.fillStyle = COLORS[char]
                ctx.fillRect(pixelX, pixelY, this._pixelSize, this._pixelSize)
            }
        }
    }

    drawLives (details, pixelSize = this._pixelSize) {
        const [count, sprite] = details
        const ctx = this._getContext()
        const yPlacement = (ORIGINAL_GAME_HEIGHT - 3) * this._pixelSize
        const spriteHeight = sprite.length
        const spriteWidth = sprite[0].length
        for (let i = 0; i < count; i++) {
            for (let row = 0; row < spriteHeight; row++) {
                for (let col = 0; col < spriteWidth; col++) {
                    if (sprite[row][col] === ' ') continue
                    const x = (col + (spriteWidth + 2) * i) * pixelSize
                    const y = yPlacement + row * pixelSize
                    ctx.fillStyle = COLORS.sc
                    ctx.fillRect(x, y, pixelSize, pixelSize)
                }
            }
        }
    }

    drawScore (stage, hiScore, score) {
        const ctx = this._getContext()
        const stageText = String('STAGE ' + stage)
        const hiScoreText = String('hi-score ' + Math.max(hiScore, score))
        const hiScoreTextSize = ctx.measureText(hiScoreText)
        const pointText = String(score + ' PTS')
        const pointTextSize = ctx.measureText(pointText)
        ctx.font = `${5 * this._pixelSize}px sans-serif`
        ctx.fillStyle = COLORS.sc
        ctx.fillText(stageText, 10, 28)
        ctx.fillText(hiScoreText, this._width - hiScoreTextSize.width - 10, 28)
        ctx.fillText(pointText, this._width - pointTextSize.width - 10,
            ORIGINAL_GAME_HEIGHT * this._pixelSize)
    }

    resize () {
        const maxPixelHeight = window.innerHeight / ORIGINAL_GAME_HEIGHT
        const maxPixelWidth = window.innerWidth / ORIGINAL_GAME_WIDTH

        this._pixelSize = parseInt(Math.min(maxPixelHeight, maxPixelWidth))
        this._height = this._pixelSize * ORIGINAL_GAME_HEIGHT
        this._width = this._pixelSize * ORIGINAL_GAME_WIDTH

        const ctx = this._getContext()
        ctx.canvas.width = this._width
        ctx.canvas.height = this._height

        this.clear()
    }
}

export default Canvas