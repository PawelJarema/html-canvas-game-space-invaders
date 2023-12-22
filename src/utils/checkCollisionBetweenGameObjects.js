export default function checkCollisionBetweenGameObjects (gameObject1, gameObject2) {
    if (gameObject1.isDisposed() || gameObject2.isDisposed()) return false

        const position1 = gameObject1.getPosition()
        const position2 = gameObject2.getPosition()

        const width1 = gameObject1._width
        const x1 = position1.getX()
        const width2 = gameObject2._width
        const x2 = position2.getX()

        const xHit = (
               x1 <= x2 + width2 - 1
            && x2 <= x1 + width1 - 1
        )

        if (!xHit) return false

        const height1 = gameObject1._height
        const y1 = position1.getY()
        const height2 = gameObject2._height
        const y2 = position2.getY()

        const yHit = (
               y1 <= y2 + height2 - 1
            && y2 <= y1 + height1 -1
        )

        if (!yHit) return false

        return true
}