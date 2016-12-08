
//import Benchmark from '../../../helpers/benchmark'

var generateArray = function (length, transform) {
    var nullArray = Array.apply(null, { length: length });
    return transform
        ? nullArray.map(transform)
        : nullArray
};

var reportResults = function (times) {
    times = [].concat(times);
    times.sort(function (a, b) { return a - b });

    var report = [
        'Fastest: ' + times[0] + 'ms',
        'Median: ' + times[times.length / 2] + 'ms',
        'Average: ' + times.reduce(function (a, b) { return a + b }, 0) / times.length + 'ms',
        '95th Perc.: ' + times[Math.ceil(times.length * 0.95)] + 'ms',
        'Slowest: ' + times[times.length - 1] + 'ms'
    ].join('\n');

    console.log(report);
    document.getElementById('results').innerHTML = report.replace(/\n/g, '<br>');
    document.getElementById('root').innerHTML = '';
};


var items = generateArray(10000);
var maxCount = 100;
var count = 0;

var now = (
    window.performance.now ||
    window.performance.webkitNow
).bind(window.performance);

var Benchmark = function (example) {

    var times = [];

    document.getElementById('results').textContent = 'Running benchmark. This may take a minute...'

    function runExample () {
        var startTime = now();
        example(items, function () {
            var totalTime = Math.ceil(now() - startTime);
            console.log(totalTime + 'ms');
            times.push(totalTime);
            count += 1;
            if (count < maxCount) {
                runExample()
            } else {
                reportResults(times)
            }
        })
    }
    setTimeout(runExample, 1)
};


var myViewModel = {
    itemsArray : ko.observableArray([])
};

new Benchmark((items, done) => {
    myViewModel.itemsArray([]);
    myViewModel.itemsArray(items);
    if(count === 0){
        var root = document.getElementById('root');
        ko.applyBindings(myViewModel, root);
        //console.log('Initial bind ....');
    }
    // else {
    //     console.log('Resetting array  .... count: ' + count);
    // }
    done();
});
