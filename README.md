# Kamelette

Kamelette is a tool for quickly testing out random color palettes on an image. It's powered by [PleaseJS](https://github.com/Fooidge/PleaseJS).

Play with it [here](https://selkkie.github.io/kamelette/)!

## Modification
If you want to modify, you'll need [browserify](https://github.com/browserify/browserify) to compile a new bundle.js file. Make changes in kamelette.js, then run `browserify kamelette.js -o bundle.js`

## To Do
* Fix color cycler
* Support other schemes, replace faulty palette size input
* Lock colors in place
* Use locked colors as starter color(s)? - PleaseJS takes only one input...
* Broaden random starter inputs... maybe
* Automatic side by side iterations?
