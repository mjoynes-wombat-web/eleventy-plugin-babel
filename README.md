# eleventy-plugin-babel

Created by [Simeon Smith](https://www.simeonsmith.dev).

A plugin for [11ty](https://www.11ty.dev/) to compile JS with [gulp-babel](https://github.com/babel/gulp-babel).

## Installation

Available on [npm](https://www.npmjs.com/).

```bash
npm i -D eleventy-plugin-sass
```

## Using Plugin

Open up your Eleventy config file (probably `eleventy.js`) and use addPlugin:

```javascript
const pluginBabel = require('eleventy-plugin-js');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginBabel, babelPluginOptions);
};
```

Read more about [Eleventy plugins](https://www.11ty.dev/docs/plugins/).

### Options

| Key        | Type                   | Default                           | Description                                                                                                      |
| ---------- | ---------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Watch      | glob or array of globs | `['**/*.js', '!node_modules/**']` | The JS files or matches of the files you wish to compile (and watch when you serve).                             |
| Uglify     | boolean                | `false`                           | If you wish your JS code to be uglified using [babel-uglify](https://github.com/terinjokes/gulp-uglify/)         |
| outputDir  | String                 | `"dist/js"`                       | The directory where the compiled JS will output.                                                                 |
| sourceMaps | Boolean                | `false`                           | If you'd liked to output sourcemaps using [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps)  |
| babel      | gulp-babel options     | `{ presets: ['@babel/env'] }`     | Options that are passed to gulp-babel. See [gulp-babel](https://github.com/babel/gulp-babel#readme) for options. |

## Contributing

Feel free to create issues with suggestions, bugs or open pull requests with changes.

## License

MIT © [Simeon Smith](https://www.simeonsmith.dev).
