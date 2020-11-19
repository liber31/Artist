//#CodeStart
export function set_fullscreen(triggerBool) {
  if (triggerBool === false) {    
    return;
  }
  
  window.variables.canvas.style.width = '100%';
  window.variables.canvas.style.height = '100%';
  window.variables.fullscreen = true;
  window.variables.canvas.width = window.innerWidth * 2;
  window.variables.canvas.height = window.innerHeight * 2;
  window.variables.display_width = window.variables.canvas.width;
  window.variables.display_height = window.variables.canvas.height;
  window.variables.display_ratio = window.variables.display_width / window.variables.display_height;
}