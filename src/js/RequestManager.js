(function() {
    var RequestManager = function() {
        this._requests = {};
        this._started = false;
        this.toSend = 0;
        this.loaded = 0;
        this.failed = 0;
    };
    
    RequestManager.prototype._onProgress = function(url, onComplete, onProgress, request) {
        if (onProgress)
            onProgress(url, request, this.failed, this.loaded, this.toSend);
    
        if (this.toSend === this.loaded + this.failed) {
            this.toSend = 0;
            this.loaded = 0;
            this.failed = 0;
            this._started = false;
            this._requests = {};
            
            if (onComplete)
                onComplete(this.failed, this.loaded);
        }
    };
    
    RequestManager.prototype._onLoad = function(url, onComplete, onProgress, request) {
        this.loaded++;
        
        request.removeEventListener('load', request._onLoad, false);
        request.removeEventListener('error', request._onError, false);

        delete request._onLoad;
        delete request._onError;
        
        this._onProgress(url, onComplete, onProgress, request);
    };
    
    RequestManager.prototype._onError = function(url, onComplete, onProgress) {
        this.failed++;
        
        this._onProgress(url, onComplete, onProgress);
    };
    
    RequestManager.prototype.file = function(url, crossOrigin, responseType) {
        var request = new XMLHttpRequest();
        
        if (crossOrigin !== undefined)
            request.crossOrigin = crossOrigin;

        if (responseType !== undefined)
            request.responseType = responseType;
        
        this.toSend++;
        
        this._requests[url] = request;
        
        return request;
    };
    
    RequestManager.prototype.image = function(url, crossOrigin) {
        var request = new Image();
        
        if (crossOrigin !== undefined)
            request.crossOrigin = crossOrigin;
        
        this.toSend++;
        
        this._requests[url] = request;
        
        return request;
    };
    
    RequestManager.prototype.send = function(onComplete, onProgress) {
        var that = this;
        var url;
        var request;
        
        if (this._started)
            return false;
            
        this._started = true;
        
        for (url in this._requests) {
            request = this._requests[url];
            
            request._onLoad = function() {
                that._onLoad(url, onComplete, onProgress, this);
            };

            request._onError = function() {
                that._onError(url, onComplete, onProgress);
            };
            
            request.addEventListener('load', request._onLoad, false);
            request.addEventListener('error', request._onError, false);
            
            if (request instanceof XMLHttpRequest) {
                request.open('GET', url, true);
                request.send(null);
            } else
                request.src = url;
        }
        
        return true;
    };
    
    window['RequestManager'] = RequestManager;
})();