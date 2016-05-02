(function() {
  /**
   * Responsible of the resource management.
   *
   * @class ResourceManager
   * @constructor
   */
  var ResourceManager = function() {
    /**
     * Array of resources represented as objects with a name and an image.
     *
     * @property {Object[]} _values
     * @private
     */
    this._values = [];
    /**
     * Position in the _values array of the selected resource.
     *
     * @property {Number} _selected
     * @private
     */
    this._selected = 0;
  };

  /**
   * Parses the resource configuration file (XML or JSON) and them uses a ResquestManager instance
   * to retrive the the images given in that file.
   *
   * @method ResourceManager#load
   * @param {Sting} data
   * @param {String} type
   * @param {DOMElement} select
   * @param {Function} [onComplete]
   * @param {Function} [onProgress]
   */
  ResourceManager.prototype.load = function(data, type, select, onComplete, onProgress) {
    var requests = new RequestManager();
    var parsed;
    var nodes;
    var node;
    var option;
    var i;

    this._values = [];

    if (type === 'json') {
      parsed = JSON.parse(data);

      for (i in parsed)
        this._values.push({
          name: i,
          image: requests.image(parsed[i])
        });
    } else {
      parsed = new DOMParser().parseFromString(data, 'text/xml');
      nodes = parsed.getElementsByTagName('resources')[0].children;

      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];

        this._values.push({
          name: node.children[0].textContent,
          image: requests.image(node.children[1].textContent)
        });
      }
    }

    for (i = 0; i < this._values.length; i++) {
      option = document.createElement('option');
      option.text = this._values[i].name;
      select.add(option, select[i]);
    }

    requests.send(onComplete, onProgress);
  };


  /**
   * Returns the image of the resource currently selected.
   *
   * @method ResourceManager#current
   * @return {Image}
   */
  ResourceManager.prototype.current = function() {
    return this._values[this._selected].image;
  };

  /**
   * Generates a new selected resource using a simple random and returns its image.
   *
   * @method ResourceManager#next
   * @return {Image}
   */
  ResourceManager.prototype.next = function() {
    var values = this._values;
    var selected;

    while (true) {
      selected = Math.floor((Math.random() * values.length));

      if (selected !== this._selected) {
        this._selected = selected;


        return values[selected].image;
      }
    }
  };

  /**
   * Returns the result of comparing a name with the name of the selected resource.
   *
   * @method ResourceManager#compare
   * @return {Image}
   */
  ResourceManager.prototype.compare = function(name) {
    return this._values[this._selected].name === name;
  };

  window['ResourceManager'] = ResourceManager;
}());
