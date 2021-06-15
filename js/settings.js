var brightness = function (x) {
    fs.writeFile('/sys/class/backlight/backlight/brightness', x, (err) => {
        if (err)
            console.log(err);
    });
}
