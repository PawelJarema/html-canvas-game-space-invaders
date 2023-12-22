export default function getGameObjectCoordinates (actor) {
    const position = actor.getPosition()
    const actorX = position.getX()
    const actorY = position.getY()
    return [actorX, actorY]
}