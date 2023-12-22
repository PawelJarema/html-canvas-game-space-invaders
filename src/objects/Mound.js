import GameObject from './GameObject'
import moundPseudosprites from '../pseudo-sprites/mound'
import deepCopyArray from '../utils/deepCopyArray'
import getPixelCollisionsBetweenGameObjects from '../utils/getPixelCollisionsBetweenGameObjects'

class Mound extends GameObject {
    constructor (position) {
        super(deepCopyArray(moundPseudosprites), position)
    }

    hitWith (projectile) {
        const pixelCollisions = getPixelCollisionsBetweenGameObjects(projectile, this)
        if (pixelCollisions) {
            const sprite = this._sprites[0]
            for (const [row, col] of pixelCollisions) {
                if (sprite[row][col]) sprite[row][col] = ' '
                if (sprite[row + projectile._dy]) sprite[row + projectile._dy][col] = ' '
            }

            projectile.dispose()
        }
    }

    isMound () {
        return true
    }
}

export default Mound