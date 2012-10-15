var tally = [];
var page = require('webpage').create();
var url = 'http://stats.espncricinfo.com/ci/engine/player/35320.html?class=2;template=results;type=allround;view=match';
//console.log(url);

page.open(url, function(status) {
    if(status != 'success') {
        console.log('Problem reaching', url, " ",  status);
    }
    else {
        var results = page.evaluate(function() {
            var data = [];
            $('table.engineTable:eq(3) tbody tr').each(
                function() {
                    var runs = $(this).children('td:eq(0)').text();
                    //not out is indicated with an asterisk
                    //e.g. 20*. isNaN will return true on it
                    //but parseInt will parse it correctly as 20
                    //so parse it first.
                    //we'll still have genuine NaNs for matches
                    //where Tendulkar did not bat (indicated by DNB)
                    //set the runs there to 0.
                    runs = parseInt(runs);
                    if (isNaN(runs)) { //DNB
                        runs = 0;
                    }
                    
                    var year = $(this).children('td:eq(8)').text().substr(-4);
                    year = parseInt(year);
                    data.push({runs: runs, year: year});
                }
            );
            return data;
        });

        var year_runs = {};
        var min_year = 3000;
        var max_year = 0;
        

        
        for (var i = 0; i < results.length; i++) {
            if (year_runs[results[i].year]) {
                year_runs[results[i].year] += results[i].runs;
            }
            else {
                year_runs[results[i].year] = results[i].runs;
            }
            if (results[i].year < min_year) {
                min_year = results[i].year;
            }
            if (results[i].year > max_year) {
                max_year = results[i].year;
            }

        }
        
        var data_points = [];
        for (var year = min_year; year <= max_year; year++) {
            if(year_runs[year]) {
                var row = {label: year, value: year_runs[year], unit: 'runs'}
                data_points.push(row);
            }
        }
        console.log(JSON.stringify(data_points));

        phantom.exit();
    }
});


