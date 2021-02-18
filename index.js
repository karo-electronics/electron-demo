const { SSL_OP_EPHEMERAL_RSA } = require('constants');
var fs = require('fs')

$(function () {
    $("#main").load("home.html");
});

function pageload(page) {
    $("#main").load(page + ".html", () => {
        // call upgradeDom() to register newly added mdl elements
        componentHandler.upgradeDom();
        $('.mdl-layout')[0].MaterialLayout.toggleDrawer();
        if (page === 'brightness') {
            fs.readFile('/sys/class/backlight/backlight/brightness', 'utf-8', (err, x) => {
                if (err)
                    console.log(err);
                else
                    // parseInt because readFile comes with linefeed
                    $('#brightness_slider')[0].MaterialSlider.change(parseInt(x));    
            });
        }
    });
}

function alert() {
    $('#demo-snackbar-example')[0].MaterialSnackbar.showSnackbar({
        message: 'You have been alerted',
        timeout: 3000,
    });
}

function brightness(x) {
    fs.writeFile('/sys/class/backlight/backlight/brightness', x, (err) => {
        if (err)
            console.log(err);
    });
}
