/*
 * globals
 */

var spawn = require('child_process').spawn;
// disable buffering to get constant output!
var child = spawn('stdbuf -i0 -o0 -e0 /bin/scd4x_i2c_example_usage', [], { shell: true });

child.stdout.on('data', function (data) {
    let measurement = data.toString().split('\n');
    if (measurement.length === 4) {
        let co2 = measurement[0].split(':')[1],
            temp = measurement[1].split(':')[1],
            hum = measurement[2].split(':')[1];

        adjustBars(co2, temp, hum);
    }
});

child.stderr.on('data', function (data) {
    console.log(data.toString());
});

child.on('close', function (code) {
    //Here you can get the exit code of the script
    console.log('closing code: ' + code);
});

var adjustBars = function(co2, temp, hum) {
  
    let $co2Bar = $(".bar-ppm"),
        $tempBar = $(".bar-c"),
        $humBar = $(".bar-rh"),
        co2Dec = parseFloat(co2.split(' ')[1]),
        tempDec = parseFloat(temp.split(' ')[1]),
        humDec = parseFloat(hum.split(' ')[1]),
        
        co2RangeStart = 400,
        co2RangeEnd = 1600,
        tempRangeStart = 15,
        tempRangeEnd = 30;

    let co2Perc, tempPerc = 0;
    
    if (co2Dec > co2RangeEnd) {
        co2Perc = 1;
    } else if (co2Dec < co2RangeStart) {
        co2Perc = 0;
    } else {
        co2Perc = (co2Dec - co2RangeStart) / (co2RangeEnd - co2RangeStart);
    }

    if (tempDec > tempRangeEnd) {
        tempPerc = 1;
    } else if (tempDec < tempRangeStart) {
        tempPerc = 0;
    } else {
        tempPerc = (tempDec - tempRangeStart) / (tempRangeEnd - tempRangeStart);
    }

    $co2Bar.css({
        transform: "rotate("+ (45+(co2Perc*100*1.8)) +"deg)", // 100%=180° so: ° = % * 1.8
        // 45 is to add the needed rotation to have the green borders at the bottom
    });

    $tempBar.css({
        transform: "rotate("+ (45+(tempPerc*100*1.8)) +"deg)", // 100%=180° so: ° = % * 1.8
        // 45 is to add the needed rotation to have the green borders at the bottom
    });

    $humBar.css({
        transform: "rotate("+ (45+(humDec*1.8)) +"deg)", // 100%=180° so: ° = % * 1.8
        // 45 is to add the needed rotation to have the green borders at the bottom
    });

    $('#ppm-text').text(co2);
    $('#c-text').text(temp);
    $('#rh-text').text(hum);

    if (co2Dec > 1000) {
        $('#air_alert').removeClass('hidden');
    } else {
        $('#air_alert').addClass('hidden');
    }
}
