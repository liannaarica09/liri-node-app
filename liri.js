var fs = require("fs");
var env = require("dotenv").config();
var keys = require("./keys.js");
var socialNetwork = process.argv[2];
var input = process.argv[3];

function getFunction() {
    if (socialNetwork === "twitter") {
        getTweets(input);
    }
    if (socialNetwork === "spotify") {
        getSongs(input);
    }
    if (socialNetwork === "omdb") {
        getMovie(input);
    }
    if (socialNetwork === "whatever") {
        doThis();
    }
}

function getTweets(twitterHandle) {
    var Twitter = require('twitter');
    var tweetsLimit = 5;

    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
    });

    var params = {
        screen_name: twitterHandle
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // if user has less than 10 tweets it will set their amount of tweets as the limit
            if (tweets.length < tweetsLimit) {
                tweetsLimit = tweets.length;
            }
            // looping through users tweets until limit is satisfied
            for (var i = 0; i < tweetsLimit; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                console.log();
            }

        } else {
            console.log(error);
        }
    });
}
//Spotify
function getSongs(songQuery) {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    if (!songQuery) {
        songQuery = "Guns and Ships";
    }

    spotify
        .search({
            type: 'track',
            query: songQuery
        })
        .then(function (response) {
            console.log("Artist: " + response.tracks.items[0].artists[0].name);
            console.log("Song: " + response.tracks.items[0].name);
            console.log("Album: " + response.tracks.items[0].album.name);

            if (response.tracks.items[0].preview_url) {
                console.log("Preview: " + response.tracks.items[0].preview_url);
            } else {
                console.log("Preview: Not available");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getMovie(movie) {
    var request = require('request');
    request("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error) {
            var result = JSON.parse(body);
            console.log('Title: ' + result.Title); // Print the HTML for the Google homepage.
            console.log('Release Date: ' + result.Released);
            console.log('IMDb Rating: ' + result.Ratings[0].Value);
            console.log('Rotten Tomatos Rating: ' + result.Ratings[1].Value);
            console.log('Metacritic Rating: ' + result.Ratings[2].Value);
            console.log('Country: ' + result.Country);
            console.log('Language: ' + result.Language);
            console.log('Plot: ' + result.Plot);
            console.log('Actors: ' + result.Actors);
            console.log('Writer: ' + result.Writer);
            console.log('Director: ' + result.Director);
        } else {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        }
    });
}

function doThis() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        dataArr = data.split(",");
        socialNetwork = dataArr[0];
        input = dataArr[1];

        getFunction();
    });
}
getFunction();