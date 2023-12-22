export default function random (max, min = 0) {
    return min + Math.random() * (max - min)
}