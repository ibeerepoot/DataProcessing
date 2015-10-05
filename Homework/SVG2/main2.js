/* use this to test out your function */
window.onload = function() {
 	changeColor('lt', '#8e44ad');
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill=color;
}