export default function getPixelCollisionsBetweenGameObjects (projectile, gameObject) {
    const smallerObject = projectile
    const biggerObject = gameObject

    const smallerObjectSprite = smallerObject.getSprite()
    const smallerObjectPosition = smallerObject.getPosition()
    const smallerObjectX = Math.round(smallerObjectPosition.getX())
    const smallerObjectY = Math.round(smallerObjectPosition.getY())

    const biggerObjectSprite = biggerObject.getSprite()
    const biggerObjectPosition = biggerObject.getPosition()
    const biggerObjectX = Math.round(biggerObjectPosition.getX())
    const biggerObjectY = Math.round(biggerObjectPosition.getY())

    const smallerObjectXShift = smallerObjectX - biggerObjectX
    const smallerObjectYShift = smallerObjectY - biggerObjectY

    const collisions = []
    for (let row = 0; row < smallerObjectSprite.length; row++) {
        const smallerObjectRow = smallerObjectSprite[row]
        const biggerObjectRowIdx = row + smallerObjectYShift
        const biggerObjectRow = biggerObjectSprite[biggerObjectRowIdx]
        if (!biggerObjectRow) continue

        for (let col = 0; col < smallerObjectSprite[0].length; col++) {
            const smallerObjectPixel = smallerObjectRow[col]
            if (smallerObject === ' ') {
                continue
            }

            const biggerObjectColIdx = col + smallerObjectXShift
            const biggerObjectPixel = biggerObjectRow[biggerObjectColIdx]
            if (!biggerObjectPixel || biggerObjectPixel === ' ') {
                continue
            }

            if (smallerObjectPixel && biggerObjectPixel) {
                collisions.push([biggerObjectRowIdx, biggerObjectColIdx])
            }
        }
    }

    if (collisions.length) return collisions
}