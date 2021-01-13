//#CodeStart

/**
 * 랜덤 값을 반환합니다.
 * @param {*} min
 * @param {*} max
 * @return number
 */
export function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 정수 랜덤 값을 반환합니다.
 * @param {*} min
 * @param {*} max
 * @return number
 */
export function irandomRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + min;
}