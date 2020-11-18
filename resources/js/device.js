//#CodeStart
export function set_fullscreen(triggerBool) {
  if (triggerBool === false) {    
    return;
  }
  
  window.variables.canvas.style.width = '100%';
  window.variables.canvas.style.height = '100%';
  window.variables.fullscreen = true;
}