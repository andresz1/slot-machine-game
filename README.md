# slot-machine-game

A very simple slot machine game using HTML5 and JavaScript only. It illustrates how to use the canvas element on mobile devices and desktops.

## Build

First, install [Grunt-CLI](http://gruntjs.com/) globally using [npm](https://www.npmjs.com/) (I assume you have pre-installed [Node.js](https://nodejs.org/)) and then the project dependencies.

```bash
npm install -g grunt-cli
cd /slot-machine-game
npm install
```

Run a local development server (livereload enabled) with this command:

```bash
grunt
```

Package the game (minify css, html and js) with:

```bash
grunt build
```

Compress the game in a zip file with:

```bash
grunt zip
```

## Usage

After building the project. You can use a server like [http-server](https://github.com/indexzero/http-server) to mount it.

```bash
cd build/
http-server
```

### Resource fetching

You could use a [JSON](https://en.wikipedia.org/wiki/JSON) or a [XML](https://en.wikipedia.org/wiki/XML) file. Those files must follow the structure given in the `resources.json` and `resources.xml` correspondingly. To do so specify the path to the file when calling the `Game.init` method:

```js
game.init('assets/resources.json');
// or
game.init('assets/resources.xml');
```

### Game rules

The `Game.maxIterations` controls the number of iterations to be done in the switch phase and the `Game.switchTime` controls the time in ms of a resource switch. Change the default values of those attributes like so:

```js
game.maxIterations = 9;
game.switchTime = 500;
```

## Feedback

Pull requests, feature ideas and bug reports are welcome.

## License

MIT.
