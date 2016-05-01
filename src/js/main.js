window.onload = function() {
  var wrapper = document.getElementById('wrapper');
  var canvas = document.getElementById('canvas');
  var resources = document.getElementById('resources');
  var game;

  canvas.width = 1024;
  canvas.height = 680;

  game = new Game(wrapper, canvas, resources);
  game.init('assets/resources.json');
};
