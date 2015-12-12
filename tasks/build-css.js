'use strict';

var fs = require('fs'),
    path = require('path'),
    // Processes
    sass = require('node-sass'),
    postCSS = require('postcss'),
    prefixer = require('autoprefixer'),
    CleanCSS = require('clean-css'),
    // Helpers
    log = require('./helpers/log'),
    writeTo = require('./helpers/writeTo'),
    cleanOutput = require('./helpers/cleanOutput'),
    prependBanner = require('./helpers/prependBanner'),
    generateGraph = require('./helpers/generateGraph');

module.exports = function(command) {
    let options = command.parent;

    return new Promise(function(resolve) {
        log.title('titon:css');

        resolve(generateGraph('css', options));
    })

    // Bundle modules
    .then(function(paths) {
        let data = ['@charset "UTF-8";', '@import "common";'];

        // Prepend namespace
        if (options.namespace) {
            log('Prepending namespace...');

            data.push('$titon: map-merge($titon, ("namespace": "' + options.namespace + '"));');
        }

        // Enable RTL mode
        if (options.rtl) {
            log('Enabling RTL mode...');

            data.push('$titon: map-merge($titon, ("text-direction": rtl));');
        }

        // Import selected modules
        log('Bundling modules...');

        paths.forEach(function(module) {
            if (fs.existsSync(path.join(options.cssSource, module))) {
                data.push('@import "' + module.replace('.scss', '') + '";');

                log(module, 1);
            }
        });

        return data.join('\n');
    })

    // Render the Sass file
    .then(function(scss) {
        log('Transpiling Sass...');

        return new Promise(function(resolve, reject) {
            sass.render({
                data: scss,
                includePaths: [options.cssSource],
                outputStyle: 'expanded',
                sourceComments: false,
                sourceMap: false,
                indentWidth: 4
            }, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.css.toString());
                }
            });
        });
    })

    // Clean up the output
    .then(cleanOutput(options))

    // Apply prefixes using autoprefixer
    .then(function(css) {
        log('Applying prefixes...');

        return postCSS([
            prefixer({ browsers: ['last 3 versions'] })
        ]).process(css)
            .then(function(response) {
                return response.css;
            })
            .catch(function(error) {
                throw new Error(error);
            });
    })

    // Prepend the banner
    .then(prependBanner(options))

    // Save the unminified file
    .then(writeTo('titon.css', options))

    // Minify the CSS
    .then(function(css) {
        log('Minifying CSS...');

        return new CleanCSS({
            advanced: true,
            debug: options.debug,
            keepSpecialComments: 1
        }).minify(css).styles;
    })

    // Save the minified file
    .then(writeTo('titon.min.css', options))

    // Finish task
    .then(function(css) {
        log.success('CSS compiled');

        return css;
    });
};