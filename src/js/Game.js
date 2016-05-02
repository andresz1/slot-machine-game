(function() {
  /**
   * Respresentation of the game, the given canvas should be inside a wrapper and has a selection
   * element inside too.
   *
   * @class Game
   * @constructor
   * @param {DOMElement} wrapper
   * @param {Canvas} canvas
   * @param {Select} select
   */
  var Game = function(wrapper, canvas, select) {
    /**
     * Wrapper of the canvas and the select elements.
     *
     * @property {DOMElement} _wrapper
     * @private
     */
    this._wrapper = wrapper;
    /**
     * Where the display of the game is going to be done.
     *
     * @property {Canvas} _canvas
     * @private
     */
    this._canvas = canvas;
    /**
     * Resource select element.
     *
     * @property {Select} _select
     * @private
     */
    this._select = select;
    /**
     * The 2d canvas context.
     *
     * @property {Context} _ctx
     * @private
     */
    this._ctx = canvas.getContext('2d');
    /**
     * Object that storages game assets.
     *
     * @property {Image|Audio[]} _assets
     * @private
     */
    this._assets = {};
    /**
     * @property {ResourceManager} _resources
     * @private
     */
    this._resources = null;
    /**
     * Image of current resource selected.
     *
     * @property {Image} _resource
     * @private
     */
    this._resource = null;
    /**
     * Switch phase started.
     *
     * @property {Boolean} _playing
     * @private
     */
    this._playing = false;
    /**
     * Previous time of main loop.
     *
     * @property {Number} _previous
     * @private
     */
    this._previous = 0;
    /**
     * Current iteration of switch phase.
     *
     * @property {Number} _iterations
     * @private
     */
    this._iterations = 0;
    /**
     * Loaded phase ended.
     *
     * @property {Number} _loaded
     * @private
     */
    this._loaded = false;

    /**
     * A game rule, it controls the number iterations to be done in the switch phase.
     *
     * @property {Number} maxIterations
     */
    this.maxIterations = 8;
    /**
     * A game rule, it controls the time in ms of a resource switch.
     *
     * @property {Number} maxIterations
     */
    this.switchTime = 500;

    this._onResize();
    window.addEventListener('resize', this._onResize.bind(this), false);
    window.addEventListener('orientationchange', this._onResize.bind(this), false);
    canvas.addEventListener('click', this._onClick.bind(this), false);
  };

  /**
   * Displays the progress bar of the assets loading process.
   *
   * @method Game#_onPreloadProgress
   * @param {XMLHttpRequest|Image|Audio} request
   * @param {Number} failed
   * @param {Number} loaded
   * @param {Number} toSend
   */
  Game.prototype._onPreloadProgress = function(request, failed, loaded, toSend) {
    var canvas = this._canvas;
    var ctx = this._ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '78px Bangers';
    ctx.fillStyle = '#663300';
    ctx.fillText('Loading:  ' + Math.round(loaded / toSend * 100) + ' %', 340, 350);
  };

  /**
   * Resizes the wrapper.
   *
   * @method Game#_onResize
   */
  Game.prototype._onResize = function() {
    var wrapper = this._wrapper;
    var canvas = this._canvas;
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;

    if (windowRatio < canvasRatio) {
      height = window.innerHeight;
      width = height / canvasRatio;
    } else {
      width = window.innerWidth;
      height = width * canvasRatio;
    }

    wrapper.style.marginLeft = ((window.innerWidth - width) / 2) + 'px';
    wrapper.style.marginTop = ((window.innerHeight - height) / 2) + 'px';

    wrapper.style.width = width + 'px';
    wrapper.style.height = height + 'px';
  };

  /**
   * Detects a click event inside the canvas. The detection of the click on the switch button is
   * done here using its bounding box. It's only enabled when the load phase ends and the user
   * isn't playing.
   *
   * @method Game#_onClick
   * @param {DOMEvent} event
   */
  Game.prototype._onClick = function(event) {
    var canvas = this._canvas;
    var bounds = canvas.getBoundingClientRect();
    var x = Math.round((event.clientX - bounds.left) / (bounds.right - bounds.left) * canvas.width);
    var y = Math.round((event.clientY - bounds.top) / (bounds.bottom - bounds.top) * canvas.height);

    if (this._loaded && !this._playing && x >= 710 && x <= 818 && y >= 470 && y <= 568) {
      this._playing = true;
      this._select.disabled = true;

      this._assets.switch.currentTime = 0;

      this._assets.switch.play();
      this._assets.win.play();
      this._assets.lose.play();

      this._assets.win.currentTime = 0;
      this._assets.lose.currentTime = 0;

      this._assets.win.pause();
      this._assets.lose.pause();
    }
  };

  /**
   * Representation of the loading phase.
   *
   * @method Game#_load
   * @param {XMLHttpRequest} request
   * @param {String} type
   */
  Game.prototype._load = function(request, type) {
    var canvas = this._canvas;
    var ctx = this._ctx;

    ctx.drawImage(this._assets.background, 0, 0, 1024, 640, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(this._assets.buttonDisable, 710, 470);

    this._select.style.display = 'inline';

    this._resources = new ResourceManager();
    this._resources.load(request.response, type, this._select, this._create.bind(this));
  };

  /**
   * Representation of the beagining of the game phase.
   *
   * @method Game#_create
   */
  Game.prototype._create = function() {
    var ctx = this._ctx;

    this._resource = this._resources.current();

    ctx.drawImage(this._assets.buttonEnable, 710, 470);
    ctx.drawImage(this._resource, 180, 250);

    this._loaded = true;

    this._update();
  };

  /**
   * Representation of the symbol switch phase. This is also the main loop.
   *
   * @method Game#_update
   * @param {Time} now
   */
  Game.prototype._update = function(now) {
    var canvas = this._canvas;
    var ctx = this._ctx;

    if (this._playing) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this._assets.background, 0, 0, 1024, 640, 0, 0, canvas.width, canvas.height);

      if (!this._previous)
        this._previous = now;
      else if (now - this._previous >= this.switchTime) {
        this._resource = this._resources.next();

        if (this._iterations++ === this.maxIterations) {
          this._previous = 0;
          this._iterations = 0;
          this._playing = false;
          this._select.disabled = false;

          ctx.drawImage(this._assets.buttonEnable, 710, 470);
          ctx.drawImage(this._resource, 180, 250);

          ctx.font = '78px Bangers';

          this._assets.switch.pause();

          if (this._resources.compare(this._select.options[this._select.selectedIndex].text)) {
            ctx.fillStyle = '#ffff33';
            ctx.fillText('You win', 630, 150);

            this._assets.win.play();
          } else {
            ctx.fillStyle = '#ff3300';
            ctx.fillText('You lose', 630, 150);

            this._assets.lose.play();
          }

          return window.requestAnimationFrame(this._update.bind(this));
        } else
          this._previous = now;
      }

      ctx.drawImage(this._assets.buttonDisable, 710, 470);
      ctx.globalAlpha = 1 - (now - this._previous) / this.switchTime;
      ctx.drawImage(this._resource, 180, 250);
      ctx.globalAlpha = 1.0;
    }

    window.requestAnimationFrame(this._update.bind(this));
  };

  /**
   * Generates requests for the assets loading.
   *
   * @method Game#init
   * @param {String} resourcesUrl
   */
  Game.prototype.init = function(resourcesUrl) {
    var that = this;
    var requests = new RequestManager();
    var resources = requests.file(resourcesUrl);

    this._assets.background = requests.image('assets/images/frontground.png');
    this._assets.buttonEnable = requests.image('assets/images/button-enable.png');
    this._assets.buttonDisable = requests.image('assets/images/button-disable.png');
    this._assets.switch = requests.audio('assets/sounds/switch.mp3');
    this._assets.win = requests.audio('assets/sounds/you-win.mp3');
    this._assets.lose = requests.audio('assets/sounds/you-lose.mp3');

    requests.send(function() {
      that._load(resources, resourcesUrl.split('/').pop().split('.').pop());
    }, this._onPreloadProgress.bind(this));
  };

  window['Game'] = Game;
}());
