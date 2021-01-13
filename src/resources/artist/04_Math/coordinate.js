//#CodeStart

export function lengthdirX(dist, angle) {
    return dist * Math.cos(angle * (Math.PI / 180));
}

export function lengthdirY(dist, angle) {
    return dist * -Math.sin(angle * (Math.PI / 180));
}

/**
 * 두 점간의 길이를 반환합니다.
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @return number
 */
export function pointDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

/**
 * 두 점간의 각도를 반환합니다.
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @return number
 */
export function pointDirection(x1, y1, x2, y2) {
    let rad = Math.atan2(y2 - y1, x2 - x1);
    let degree = (rad * 180) / Math.PI;
    if (degree < 0) {
        degree = 360 + degree;
    }
    return 360 - degree;
}