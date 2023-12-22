import {
    ORIGINAL_GAME_HEIGHT,
    ORIGINAL_GAME_WIDTH,
} from '../../constants/dimensions'
import SIGNALS from '../../constants/signals'

const DEFAULT_ENEMY_GROUP_MOVEMENT_PATTERN_MIXIN = {

    movePattern (group) {
        let dx = group._dx * group._speed
        let dy = group._dy

        const nextLeftX = group._x + dx
        const nextRightX = group._lastX + dx + 10

        if (nextRightX > ORIGINAL_GAME_WIDTH) {
            dx = 0
            dy += 9
            group._dx = -1

        } else if (nextLeftX <= 0) {
            dx = 0
            dy += 9
            group._dx = 1
        }

        const nextY = group._lastY + dy + 9

        if (nextY >= ORIGINAL_GAME_HEIGHT) {
            dx = 0
            dy = 0
            group._signals.broadcast(SIGNALS.sound, 'explosion')
            group._signals.broadcast(SIGNALS.gameOver)
        }

        return [dx, dy]
    }
}

export default DEFAULT_ENEMY_GROUP_MOVEMENT_PATTERN_MIXIN