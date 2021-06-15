// requires
var dateFormat = require("dateformat");
var fs = require('fs');

// (function exportGPIOs() {
//     fs.writeFile('/sys/class/gpio/export', '84', (err) => {
//         if (err)
//             console.log(err);
//     });
//     fs.writeFile('/sys/class/gpio/gpio84/direction', 'low', (err) => {
//         if (err)
//             console.log(err);
//     });
// })();

// always 100% backlight at start, to eliminate noise
(function backlightFull() {
    fs.writeFile('/sys/class/backlight/backlight/brightness', '100', (err) => {
        if (err)
            console.log(err);
    });
})();

// when all scripts loaded, show startpage
$(function () {
    pageload("home", false);
});

var pageload = function (page, toggleMenu) {
    // stop all ongoing polls
    polling = false;
    logging = false;

    $("#main").load(`html/${page}.html`, () => {
        // call upgradeDom() to register newly added mdl elements
        componentHandler.upgradeDom();

        // toggle menu sidebar if desired
        if (toggleMenu)
            $('.mdl-layout')[0].MaterialLayout.toggleDrawer();

        if (page === 'settings') {
            fs.readFile('/sys/class/backlight/backlight/brightness', 'utf-8', (err, x) => {
                if (err)
                    console.log(err);
                else
                    // parseInt because readFile comes with linefeed
                    $('#brightness_slider')[0].MaterialSlider.change(parseInt(x));
            });
        }
    });

    // set page title
    $("#header-pagetitle").text(capitalize(page));
}

var showError = function (msg) {
    console.error(msg);
    $('#error_alert')[0].MaterialSnackbar.showSnackbar({
        message: msg,
        timeout: 6000,
    });
}

var showInfo = function (msg) {
    console.log(msg);
    $('#info_alert')[0].MaterialSnackbar.showSnackbar({
        message: msg,
        timeout: 6000,
    });
}

// const functions
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const allEqual = (arr) => arr.every(val => val === arr[0]);
const allUnequalVal = (arr, x) => arr.every(val => val !== x);
