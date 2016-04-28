(function(){
    var canvas = document.getElementById('canvas');
    var game = new Game(canvas);
    var assets = {
        resources : 'assets/resources.xml',
        background: 'assets/images/background.png',
        buttonEnable: 'assets/images/button-enable.png',
        buttonDisable: 'assets/images/button-disable.png' 
    };
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    game.preload(assets);
}());