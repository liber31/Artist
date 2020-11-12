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

export function random_range(min, max) {
  return Math.random() * (max - min) + min;
}

export function irandom_range(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function ease_in_quad(value) {
  return value * value;
}

export function ease_out_quad(value) {
  return -value * (value - 2);
}

export function ease_in_out_quad(value) {
  let t = value * 2;

  if (t < 1) {
    return 0.5 * t * t;
  }

  t -= 1;
  return -0.5 * (t * (t - 2) - 1);
}

export function ease_in_cubic(value) {
  return value * value * value;
}

export function ease_out_cubic(value) {
  let t = value - 1;
  return t * t * t + 1;
}

export function ease_in_out_cubic(value) {
  let t = value * 2;
  
  if (t < 1) {
    return 0.5 * t * t * t;
  }
  
  t -= 2;
  return 0.5 * (t * t * t + 2);
}

export function ease_in_quartic(value) {
  return value * value * value * value;
}

export function ease_out_quartic(value) {
  let t = value - 1;
  return -(t * t * t * t - 1);
}

export function ease_in_out_quartic(value) {
  let t = argument0 * 2;
  
  if (t < 1) {
    return 0.5 * t * t * t * t;
  }
  
  t -= 2;
  return -0.5 * (t * t * t * t - 2);
}

export function ease_in_quintic(value) {
  return value * value * value * value * value;
}

export function ease_out_quintic(value) {
  let t = value - 1;
  return t * t * t * t * t + 1;
}

export function ease_in_out_quintic(value) {
  let t = argument0 * 2;
  
  if (t < 1) {
    return 0.5 * t * t * t * t * t;
  }
  
  t -= 2;
  return 0.5 * (t * t * t * t * t + 2);
}

export function ease_in_sine(value) {
  return -cos(value * Math.PI / 2) + 1;
}

export function ease_out_sine(value) {
  return sin(value * Math.PI / 2);
}

export function ease_in_out_sine(value) {
  return -0.5 * (cos(value * Math.PI) - 1);
}

export function ease_in_expo(value) {
  if (value === 0) {
    return 0;
  }
  return Math.pow(2, 10 * (value - 1));
}

export function ease_out_expo(value) {
  if (value === 1) {
    return 1;
  }
  return -Math.pow(2, -10 * value) + 1;
}

export function ease_in_out_expo(value) {
  if (value === 0) {
    return 0;
  } else if (value === 1) {
    return 1;
  }
  
  let t = value * 2;
  
  if (t < 1) {
    return 0.5 * Math.pow(2, 10 * (t - 1));
  }
  
  return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
}

export function ease_in_circ(value) {
  if (argument0 <= 0) {
    return 0;
  } else if (argument0 >= 1) {
    return 1;
  }
  return -(Math.sqrt(1 - value * value) - 1);
}

export function ease_out_circ(value) {
  if (value <= 0) {
    return 0;
  } else if (value >= 1) {
    return 1;
  }
  
  let t = value - 1;
  return Math.sqrt(1 - t * t);
}

export function ease_in_out_circ(value) {
  if (value <= 0) {
    return 0;
  } else if (value >= 1) {
    return 1;
  }
  
  let t =value * 2;
  
  if (t < 1) {
    return -0.5 * (Math.sqrt(1 - t * t) - 1);
  }
  
  t -= 2;
  return 0.5 * (Math.sqrt(1 - t * t) + 1);
}

export function ease_in_elastic(value) {
  if (value === 0) {
    return 0;
  } else if (value === 1) {
    return 1;
  }
  let p = 0.3;
  let s = p / 4;
  let t = value - 1;
  return -(Math.pow(2, 10 * t)) * Math.sin((t - s) * (2 * Math.PI) / p);
}

export function ease_out_elastic(value) {
  if (value === 0) {
    return 0;
  } else if (value === 1) {
    return 1;
  }
  
  let p = 0.3;
  let s = p / 4;
  return Math.pow(2, -10 * value) * Math.sin((value - s) * (2 * Math.PI) / p) + 1;
}

export function ease_in_out_elastic(value) {
  if (value === 0) {
    return 0;
  } else if (value === 1) {
    return 1;
  }
  
  let p = 0.3;
  let s = p / 4;
  let t = value * 2 - 1;
  
  if (t < 0) {
    return -0.5 * (Math.pow(2, 10 * t) * Math.sin((t - s) * (2 * Math.PI) / p));
  }
  
  return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
}

export function ease_in_back(value) {
  let s = 1.70158;
  return value * value * ((s + 1) * value - s);
}

export function ease_out_back(value) {
  let s = 1.70158;
  let t = value - 1;
  return t * t * ((s + 1) * t + s) + 1;
}

export function ease_in_out_back(value) {
  let s = 1.70158;
  let t = value * 2;
  s *= 1.525;
  if (t < 1) {
    return 0.5 * (t * t *((s + 1) * t - s));
  }
  
  t -= 2;
  return 0.5 * (t * t * ((s + 1) * t + s) + 2);
}

export function ease_in_bounce(value) {
  return 1 - ease_out_bounce(1 - value);
}

export function ease_out_bounce(value) {
  let t = value;
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
   t -= 1.5 / 2.75;
    return 7.5625 * t * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    t -= 2.25 / 2.75;
    return 7.5625 * t * t + 0.9375;
  } else {
    t -= 2.625 / 2.75; 
    return 7.5625 * t * t + 0.984375;
  }
}

export function ease_in_out_bounce(value) {
  if (value < 0.5) {
    return 0.5 - ease_out_bounce(1 - value * 2) * 0.5;
  } else {
    return 0.5 + ease_out_bounce(value * 2 - 1) * 0.5;
  }
}