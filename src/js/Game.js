(function() {
    var Game = function(canvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        this._assets = {};
    };
    
    Game.prototype.onPreloadProgress = function() {
        
    };
    
    Game.prototype.preload = function(assets) {
        var that = this;
        var requests = new RequestManager();
        var url = assets.resources;
        var resources = requests.file(url);
        
        this._assets.background = requests.image(assets.background);
        this._assets.buttonEnable = requests.image(assets.buttonEnable);
        this._assets.buttonDisable = requests.image(assets.buttonDisable);
        
        requests.send(function() {
            that.load(resources, url.split('/').pop().split('.').pop());
        }, this.onPreloadProgress);
    };
    
    Game.prototype.load = function(request, type) {
        var ctx = this._ctx;
        
        this._resources = new ResourceManager();
        this._resources.load(request.response, type, this.create);
        
        console.log(this._resources);
        
        //ctx.fillRect(0, 0, 800, 600);
        /*var img = this._assets.background;
        var canvas = this._canvas;
        var wrh = img.width / img.height;
        var newWidth = canvas.width;
        var newHeight = newWidth / wrh;
        if (newHeight > canvas.height) {
            newHeight = canvas.height;
            newWidth = newHeight * wrh;
        }
        */
        ctx.drawImage(this._assets.background, 0, 0, 1024, 680, 0, 0, canvas.width, canvas.height);
    };
    
    Game.prototype.create = function() {
        
    };
    
    Game.prototype.update = function() {
        
    };

    window['Game'] = Game;
}());