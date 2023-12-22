import COLORS from './constants/colors'

class LevelScreen {
    constructor (options) {
        const { callback, durationSec, text } = options

        this.show(text)
        setTimeout(() => this.hide(callback), durationSec * 1000)
    }

    hide (callback) {
        const screen = document.getElementById('level-screen')
        screen.remove()
        callback()
    }

    show (text) {
        const screen = document.createElement('div')
        screen.id = 'level-screen'
        screen.style.alignItems = 'center'
        screen.style.background = COLORS.bl
        screen.style.color = COLORS.v
        screen.style.display = 'flex'
        screen.style.fontFamily = 'Nosifier'
        screen.style.fontSize = 'min(8vh,10vw)'
        screen.style.height = '100vh'
        screen.style.justifyContent = 'center'
        screen.style.left = '0px'
        screen.style.position = 'fixed'
        screen.style.top = '0px'
        screen.style.width = '100vw'
        screen.style.zIndex = 10

        screen.innerText = text

        document.body.appendChild(screen)
    }
}

export default LevelScreen