var app_choice = process.argv[2];
var user_choice = process.argv[3];

var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");

var napsterkey=keys.napsterKeys.consumer_key;
var omdbkey=keys.omdbKeys.consumer_key;


function append_file(text) {
    fs.appendFile("log.txt", text, function(err) {

        // If an error was experienced we say it.
        if (err) {
            console.log(err);
        } else {
            null; //console.log("Content Added!");
        }

    })
}




function initialize(url, app_choice) {
    var options = {
        url: url,

    };
    return new Promise(function(resolve, reject) {
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}

function main(url, app_choice) {
    var initializePromise = initialize(url);
    initializePromise.then(function(result) {

        if (app_choice === "my-tweets") {

            for (i = 0; i < result.length; i++) {
                console.log(result[i].title);
                console.log(result[i].content);
                append_file(result[i].title);
                append_file(result[i].content);
            }
        }

        if (app_choice === "spotify-this-song") {
            console.log(result.search.data.tracks[0].name);
            console.log(result.search.data.tracks[0].artistName);
            console.log(result.search.data.tracks[0].href);
            console.log(result.search.data.tracks[0].albumName);
            append_file(result.search.data.tracks[0].name);
            append_file(result.search.data.tracks[0].artistName);
            append_file(result.search.data.tracks[0].href);
            append_file(result.search.data.tracks[0].albumName);
        }


        if (app_choice === "movie-this") {
            console.log(result.Title);
            console.log(result.Year);
            console.log(result.imdbRating);
            console.log(result.Ratings[1].Value)
            console.log(result.Country);
            console.log(result.Language);
            console.log(result.Plot);
            console.log(result.Actors);
            append_file(result.Title);
            append_file(result.Year);
            append_file(result.imdbRating);
            append_file(result.Ratings[1].Value)
            append_file(result.Country);
            append_file(result.Language);
            append_file(result.Plot);
            append_file(result.Actors);

        }

    }, function(err) {
        console.log(err);
    })
}



append_file(app_choice + " " + user_choice);


if (app_choice === "my-tweets") {

    main("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=20", "my-tweets")

}

if (app_choice === "spotify-this-song") {
//YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4
    main("http://api.napster.com/v2.2/search/verbose?apikey="+napsterkey+"&per_type_limit=1&query=" + user_choice + "&type=track", "spotify-this-song")

}

if (app_choice === "movie-this") {

    if (typeof user_choice === 'undefined') {

        user_choice = "Mr. Nobody";

    }
    main("http://www.omdbapi.com/?t=" + user_choice + "&y=&plot=short&apikey="+omdbkey , "movie-this");

}
if (app_choice === "do-what-it-says") {


    fs.readFile('random.txt', 'utf8', function(err, contents) {

        user_choice = contents;

        main("http://api.napster.com/v2.2/search/verbose?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&per_type_limit=1&query=" + user_choice + "&type=track", "spotify-this-song")


    })
}