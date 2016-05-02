window.onload = function() {
  var wrapper = document.getElementById('wrapper');
  var canvas = document.getElementById('canvas');
  var resources = document.getElementById('resources');
  var game;

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {
        return window.setTimeout(callback, 1000 / 60);
      };
  })();

  canvas.width = 1024;
  canvas.height = 680;

  game = new Game(wrapper, canvas, resources);
  game.init('assets/resources.json');
};
