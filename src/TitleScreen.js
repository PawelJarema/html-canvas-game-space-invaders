import COLORS from './constants/colors'

const TEXT = {
    gameTitle: 'SPACE\n',
    gameSubtitle: 'INVADERS',
    hiScore: 'HI score:',
    startGame: 'START GAME',
}

class TitleScreen {
    _highScore = null

    constructor (game) {
        const titleScreen = document.createElement('div')
        titleScreen.id = 'title-screen'
        titleScreen.style.alignItems = 'center'
        titleScreen.style.background = '#121212'
        titleScreen.style.color = '#fff'
        titleScreen.style.display = 'flex'
        titleScreen.style.flexDirection = 'column'
        titleScreen.style.gap = '3vh'
        titleScreen.style.height = '100vh'
        titleScreen.style.justifyContent = 'center'
        titleScreen.style.left = 0
        titleScreen.style.position = 'fixed'
        titleScreen.style.top = 0
        titleScreen.style.width = '100vw'

        const title = document.createElement('h1')
        title.textContent = TEXT.gameTitle
        title.style.color = COLORS.v
        title.style.fontFamily = 'Nosifier'
        title.style.fontSize = 'min(12vh,16vw)'
        title.style.fontWeight = 900
        title.style.lineHeight = '1'
        title.style.marginBottom = '0px'
        title.style.textAlign = 'center'
        title.style.whiteSpace = 'pre-line'

        const span = document.createElement('span')
        span.style.color = COLORS.v
        span.style.display = 'block'
        span.style.fontSize = 'min(8vh,12vw)'
        span.style.marginTop = '-6px'
        span.innerText = TEXT.gameSubtitle
        title.appendChild(span)

        const button = document.createElement('button')
        const buttonColor = 'coral'
        button.style.background = '#161616'
        button.style.border = `5px solid ${buttonColor}`
        button.style.color = buttonColor
        button.style.cursor = 'pointer'
        button.style.fontSize = '18px'
        button.style.padding = '20px'

        button.textContent = TEXT.startGame
        button.addEventListener('click', game.start.bind(game))

        titleScreen.appendChild(title)
        titleScreen.appendChild(button)

        document.body.appendChild(titleScreen)
    }

    hide () {
        const titleScreen = document.getElementById('title-screen')
        titleScreen.style.display = 'none'
    }

    darken () {
        const titleScreen = document.getElementById('title-screen')
        titleScreen.style.display = 'flex'
        titleScreen.style.opacity = '0.94'
    }
}

export default TitleScreen