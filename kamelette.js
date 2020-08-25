'use strict';
const PIXI = require('pixi.js');
const PF = require('pixi-filters');
const getColors = require('get-image-colors');

var originalColors = [];

const sauce = './marilyn.jpg';

(function () {
    let app = new PIXI.Application({
        width: 500,
        height: 500,
        antialias: true,
        transparent: true,
        resolution: 1
    });

    document.getElementById("canvas").appendChild(app.view);

    var n = "";

    resetpalette(sauce);

    runpix(new PIXI.Texture(new PIXI.BaseTexture(sauce)), {
        width: 200,
        height: 200
    });
    window.reset = function () {
        console.log("Resetting");
        n.filters = [];
    }
    window.uplButton = function () {
        //   removeAllChildNodes(document.getElementById("canvas"));
        console.log("Uploading");

        resetpalette(doBlob());


    }

    function doBlob() {
        var upload = document.getElementById("fileup").files[0];

        var blobURL = URL.createObjectURL(upload);

        // console.log("the blob URL is: " + blobURL);
        var img = new Image();
        img.addEventListener("load", function (event) {

            // URL.revokeObjectURL(blobURL);
            var aspc = {
                width: img.width,
                height: img.height
            };

            runpix(texture, aspc);

        }); // onload revoke the blob URL (because the browser has loaded and parsed the image data)
        img.src = blobURL;
        var texture = new PIXI.Texture(new PIXI.BaseTexture(img));
        return blobURL;
    }
    window.numberChange = function () {
        resetpalette(doBlob());
    }

    function resetpalette(urlof) {
        originalColors = [];
        var paletteSize = document.getElementById("nocol").value;
        console.log("Palettesize " + paletteSize);
        getColors(urlof, {
            count: paletteSize
        }).then(colors => {
            removeAllChildNodes(document.getElementById("colors"));
            colors.forEach(color => {
                originalColors.push(color.rgb());
                // console.log("color " + color);
                var blot = document.createElement("INPUT");
                blot.classList.add("blot");
                blot.type = "COLOR";
                blot.onchange = function () {
                    paletteChange();
                };
                blot.value = color;
                document.getElementById("colors").appendChild(blot);
            });
            console.log("set colors " + originalColors);
        })
    }
    window.paletteChange = function () {
        setOC();
    }

    function setOC() {
        originalColors = [];
        var children = document.getElementById("colors").children;
        for (var i = 0; i < children.length; i++) {
            var tableChild = children[i];
            console.log(hexToRgb(tableChild.value));
            originalColors.push(hexToRgb(tableChild.value));
            // Do stuff
        }
    }
    window.lockUnlock = function () {
        changeLocks();
    }

    function changeLocks() {

    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
             parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    function colormind(inputcolors, callback) {
        var url = "http://colormind.io/api/";
        var data = {
            model: "default",
            input: inputcolors
        }
        // ex inputcolors [[44, 43, 44], [90, 83, 82], "N", "N", "N"]
        var http = new XMLHttpRequest();

        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                var palette = JSON.parse(http.responseText).result;

                //  console.log("colormind retrieved: " + palette);
                callback(palette);
            }
        }

        http.open("POST", url, true);
        http.send(JSON.stringify(data));
    }


    function runpix(img, aspc) {
        if (n) app.stage.removeChild(n);
        const marilyn = new PIXI.Sprite(img);
        n = marilyn;

        var rct = calculateAspectRatioFit(aspc.width, aspc.height, 500, 500);

        marilyn.height = rct.h;
        marilyn.width = rct.w;

        marilyn.x = (500 - rct.w) / 2;
        marilyn.y = (500 - rct.h) / 2;

        app.stage.addChild(marilyn);
    }
    window.recolorize = function () {
        filterize(originalColors);
    }

    function filterize(colors) {
        console.log("colors " + colors);
        var oldPaletteArray = [];
        colors.forEach(color => {
            //    console.log(color);
            var b = [];
            color.forEach(numb => {
                b.push(numb / 255);
            })
            oldPaletteArray.push(b);
            // col.push(color._rgb);
            // console.log("rev " + hexToHex(color));
        })
        console.log("oldarray " + oldPaletteArray);
        //colormind(colors, function (newcols) {
        colormind([], function (newcols) {
            console.log("fk " + JSON.stringify(newcols));
            var newPaletteArray = [];

            newcols.forEach(color => {
                var c = [];
                color.forEach(numb => {
                    c.push(numb / 255);
                })
                newPaletteArray.push(c);
            })
            console.log("new " + newPaletteArray);

            var filterOptions = mergeArrays(oldPaletteArray, newPaletteArray);
            //    filterOptions.push(.2); //replace this with configurable html option later
            var filterBleed = document.getElementById("tolerance").value;

            n.filters = [new PF.MultiColorReplaceFilter(filterOptions, filterBleed)];

        });
        //                n.filters = [new PF.MultiColorReplaceFilter(
        //                              [[0xE76281, 0xFF00FF],
        //                                    [0xEDED8E, 0x00FF00], ],
        //                    .2
        //                )];

        //     n.filters = [new PF.AsciiFilter()];
    }

    function mergeArrays(array1, array2) {
        var mergedArray = [];
        //should probably add catch here for mismatched array lengths but eh
        for (var x = 0; x < array1.length; x++) {
            mergedArray.push([array1[x], array2[x]]);
        }
        return mergedArray;
    }

    function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return {
            w: srcWidth * ratio,
            h: srcHeight * ratio
        };
    }

    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}());
