const Papa = require('papaparse');
const fs = require('fs');
const { DateTime, Settings } = require('luxon');

var buf = fs.readFileSync('./movies_metadata.csv').toString();

var json = Papa.parse(buf, { "header": true });

var records = [];
var generes = [];

var minBudget = 100000000;
var maxBudget = 0;
var minRevenue = 1000000;
var maxRevenue = 0;
var minPopularity = 100;
var maxPopularity = 0;
var minRuntime = 500;
var maxRuntime = 0;

for (var i = 0; i < json.data.length; i++) {
    var data = json.data[i];
    if (data.adult == 'False') {
        var genreStr = data.genres.replace(/'/g, '"');
        var movieGeneres = [];
        try {
            var generesObjList = JSON.parse(genreStr);
            for( var j=0; j<generesObjList.length; j++){
                var genere = generesObjList[j].name;
                movieGeneres.push(genere);
                if( !generes.includes(genere) ) generes.push(genere);
            }
            if (generesObjList.length > 0) {
                var revenue = parseInt(data.revenue);
                if (revenue < minRevenue) minRevenue = revenue;
                if (revenue > maxRevenue) maxRevenue = revenue;

                var popularity = parseFloat(data.popularity);
                if (popularity < minPopularity) minPopularity = popularity;
                if (popularity > maxPopularity) maxPopularity = popularity;

                var budget = parseInt(data.budget);
                if (budget < minBudget) minBudget = budget;
                if (budget > maxBudget) maxBudget = budget;

                var runtime = parseInt(data.runtime);
                if (runtime < minRuntime) minRuntime = runtime;
                if (runtime > maxRuntime) maxRuntime = runtime;

                var record = {
                    "budget": budget,
                    "language": data.original_language,
                    "popularity": parseFloat(data.popularity),
                    "posterPath": data.poster_path,
                    "revenue": revenue,
                    "runtime": runtime,
                    "title": data.title,
                    "genres": movieGeneres,
                    "releaseDate": data.release_date
                }

                records.push(record);

            }
        } catch (err) {

        }
    }
}

fs.writeFileSync('./moviedata.json', JSON.stringify(records));
fs.writeFileSync('./generes.json', JSON.stringify(generes));

console.log( `Popularity: ${minPopularity} -> ${maxPopularity}`);
console.log( `Revenue ${minRevenue} -> ${maxRevenue}` );
console.log( `Popularity: ${minPopularity} -> ${maxPopularity}`);
console.log( `Budget ${minBudget} -> ${maxBudget}` );
console.log( `Runtime: ${minRuntime} -> ${maxRuntime}`);

console.log(`Records ${records.length}`);
