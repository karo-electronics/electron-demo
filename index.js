const { SSL_OP_EPHEMERAL_RSA } = require('constants');
var fs = require('fs')

$(function() {
    $("#main").load("home.html");
});

function pageload(page) {
    $("#main").load(page + ".html", () => {
        // call upgradeDom() to register newly added mdl elements
        componentHandler.upgradeDom();
        $('.mdl-layout')[0].MaterialLayout.toggleDrawer();
        if (page === 'hardware') {
            // set trigger to timer
            fs.writeFile('/sys/class/leds/Heartbeat/trigger', 'timer', (err) => {
                if (err) {
                    console.log(err);
                } else {
                    frequency(2);
                    $('#frequency_slider')[0].MaterialSlider.change(2);
                }
            });
        }
    });
}

function alert() {
    $('#demo-snackbar-example')[0].MaterialSnackbar.showSnackbar({
        message: 'You have been alerted',
        timeout: 2000,
    });
}

function frequency(x) {
    let frequency = 1000 - x;
    fs.writeFile('/sys/class/leds/Heartbeat/delay_off', frequency, (err) => {
        if (err)
            console.log(err);
    });
    fs.writeFile('/sys/class/leds/Heartbeat/delay_on', frequency, (err) => {
        if (err)
            console.log(err);
    });
}