export default function clampPosition (coordinate, clampTo) {
    return coordinate < 0
        ? coordinate % clampTo + clampTo
        : coordinate % clampTo
}