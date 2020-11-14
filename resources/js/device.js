//#CodeStart
export function set_fullscreen(triggerBool) {
  if (triggerBool === false) {
    const displayWidth = window.variables.canvas.clientWidth;
    const displayHeight = window.variables.canvas.clientHeight;
    window.variables.display_width = displayWidth;
    window.variables.display_height = displayHeight;
    return;
  }
  
  window.variables.canvas.style.width = '100vw';
  window.variables.canvas.style.height = '100vh';
  const displayWidth = window.variables.canvas.clientWidth;
  const displayHeight = window.variables.canvas.clientHeight;

  if (window.variables.canvas.width != displayWidth || window.variables.canvas.height != displayHeight) {
    // mul 2 for retina display
    window.variables.canvas.width = displayWidth * 2;
    window.variables.canvas.height = displayHeight * 2;
    window.variables.display_width = displayWidth * 2;
    window.variables.display_height = displayHeight * 2;
  }
  
  window.variables.fullscreen = true;
}