export function lengthdir_x(dist, angle) {
    return dist * Math.cos(angle * (Math.PI / 180));
}

export function lengthdir_y(dist, angle) {
    return dist * -Math.sin(angle * (Math.PI / 180));
}

export function point_distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function point_direction(x1, y1, x2, y2) {
  let rad = Math.atan2(y2 - y1, x2 - x1);
  let degree = (rad * 180) / Math.PI;
  if (degree < 0) {
    degree = 360 + degree;
  }
  return 360 - degree;
}