(function() {
    var ResourceManager = function() {
    };
    
    ResourceManager.prototype.load = function(data, type, onComplete, onProgress) {   
        var requests = new RequestManager();
        var parsed;
        var nodes;
        var node;
        var i;
        
        if (type === 'json') {
            parsed = JSON.parse(data);
            
            for (i in parsed)
                this[i] = requests.image(parsed[i]);
        } else {
            parsed = new DOMParser().parseFromString(data, "text/xml");
            nodes = parsed.getElementsByTagName("resources")[0].children;
            
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                this[node.children[0].textContent] = requests.image(node.children[1].textContent);
            }
        }
        
        requests.send(onComplete, onProgress);
    };
    
    window['ResourceManager'] = ResourceManager;
}());