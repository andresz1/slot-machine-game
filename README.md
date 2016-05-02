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

### Feedback

Pull requests, feature ideas and bug reports are welcome.

### License

MIT.
