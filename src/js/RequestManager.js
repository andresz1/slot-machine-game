(function() {
  /**
   * Responsibles of the request management.
   *
   * @class RequestManager
   * @constructor
   */
  var RequestManager = function() {
    /**
     * Queue of requests.
     *
     * @property {XMLHttpRequest|Image|Audio[]} _requests
     * @private
     */
    this._requests = [];
    /**
     * Currently working or not.
     *
     * @property {Boolean} _started
     * @private
     */
    this._started = false;

    /**
     * Requests to send.
     *
     * @property {Number} toSend
     */
    this.toSend = 0;
    /**
     * Loaded requests.
     *
     * @property {Number} loaded
     */
    this.loaded = 0;
    /**
     * Failed requests.
     *
     * @property {Number} failed
     */
    this.failed = 0;
  };

  /**
   * Manages the load and error of every request, it also calls onProgress and onComplete callback.
   *
   * @method RequestManager#_onProgress
   * @param {XMLHttpRequest|Image|Audio} request
   * @param {Function} [onComplete]
   * @param {Function} [onProgress]
   */
  RequestManager.prototype._onProgress = function(request, onComplete, onProgress) {
    if (onProgress)
      onProgress(request, this.failed, this.loaded, this.toSend);

    if (this.toSend === this.loaded + this.failed) {
      this.toSend = 0;
      this.loaded = 0;
      this.failed = 0;
      this._started = false;
      this._requests = [];

      if (onComplete)
        onComplete(this.failed, this.loaded);
    }
  };

  /**
   * Manages the load a of request.
   *
   * @method RequestManager#_onLoad
   * @param {XMLHttpRequest|Image|Audio} request
   * @param {Function} [onComplete]
   * @param {Function} [onProgress]
   */
  RequestManager.prototype._onLoad = function(request, onComplete, onProgress) {
    this.loaded++;

    request.removeEventListener('load', request._onLoad, false);
    request.removeEventListener('loadeddata', request._onLoad, false);
    request.removeEventListener('error', request._onError, false);

    delete request._onLoad;
    delete request._onError;

    this._onProgress(request, onComplete, onProgress);
  };

  /**
   * Manages the error a of request.
   *
   * @method RequestManager#_onError
   * @param {XMLHttpRequest|Image|Audio} request
   * @param {Function} [onComplete]
   * @param {Function} [onProgress]
   */
  RequestManager.prototype._onError = function(request, onComplete, onProgress) {
    this.failed++;

    this._onProgress(request, onComplete, onProgress);
  };

  /**
   * Adds a file request to the queue.
   *
   * @method RequestManager#file
   * @param {String} url
   * @param {Boolean} [crossOrigin]
   * @param {String} [responseType]
   * @return {XMLHttpRequest}
   */
  RequestManager.prototype.file = function(url, crossOrigin, responseType) {
    var request = new XMLHttpRequest();
    request.url = url;

    if (crossOrigin !== undefined)
      request.crossOrigin = crossOrigin;

    if (responseType !== undefined)
      request.responseType = responseType;

    this.toSend++;

    this._requests.push(request);

    return request;
  };

  /**
   * Adds a image request to the queue.
   *
   * @method RequestManager#image
   * @param {String} url
   * @param {Boolean} [crossOrigin]
   * @return {Image}
   */
  RequestManager.prototype.image = function(url, crossOrigin) {
    var request = new Image();
    request.url = url;

    if (crossOrigin !== undefined)
      request.crossOrigin = crossOrigin;

    this.toSend++;

    this._requests.push(request);

    return request;
  };

  /**
   * Adds a audio request to the queue.
   *
   * @method RequestManager#audio
   * @param {String} url
   * @param {Boolean} [crossOrigin]
   * @return {Audio}
   */
  RequestManager.prototype.audio = function(url, crossOrigin) {
    var request = new Audio();
    request.url = url;

    if (crossOrigin !== undefined)
      request.crossOrigin = crossOrigin;

    this.toSend++;

    this._requests.push(request);

    return request;
  };

  /**
   * Sends all requests queued.
   *
   * @method RequestManager#send
   * @param {Function} [onComplete]
   * @param {Function} [onProgress]
   * @return {Boolean}
   */
  RequestManager.prototype.send = function(onComplete, onProgress) {
    var that = this;
    var i;
    var request;

    if (this._started)
      return false;

    this._started = true;

    for (i = 0; i < this._requests.length; i++) {
      request = this._requests[i];

      request._onLoad = function() {
        that._onLoad(this, onComplete, onProgress);
      };

      request._onError = function() {
        that._onError(this, onComplete, onProgress);
      };

      if (request instanceof Audio) {
        request.addEventListener('loadedmetadata', request._onLoad, false);
        request.src = request.url;
      } else {
        request.addEventListener('load', request._onLoad, false);
        request.addEventListener('error', request._onError, false);

        if (request instanceof XMLHttpRequest) {
          request.open('GET', request.url, true);
          request.send(null);
        } else
          request.src = request.url;
      }
    }

    return true;
  };

  window['RequestManager'] = RequestManager;
})();
