export default function spreadOutVariousGameObjects (gameObjects) {
    const actors = []
    const projectiles = []

    for (const object of gameObjects) {
        if (object.isProjectile) projectiles.push(object)
        else if (object.isGroup) actors.push(...object.getActors())
        else actors.push(object)
    }

    return [actors, projectiles]
}