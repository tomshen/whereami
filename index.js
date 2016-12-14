#!/usr/bin/env nodejs

let cors = require("cors");
let express = require("express");
let https = require("https");

let config = require("./config.json");

let app = express();
app.use(cors({
    origin: "http://www.tomshen.me"
}));

app.get("/", (req, res) => {
    let requestUrl = `https://api.foursquare.com/v2/users/self/checkins`;
    https.get({
        hostname: "api.foursquare.com",
        path: `/v2/users/self/checkins?oauth_token=${config.foursquareAccessToken}&v=20161215`
    }, (foursquareRes) => {
        let body = "";

        foursquareRes.on("data", (chunk) => {
            body += chunk;
        });

        foursquareRes.on("end", () => {
            try {
                let data = JSON.parse(body);
                let latestCheckin = data.response.checkins.items[0];

                let location = latestCheckin.location || latestCheckin.venue.location;
                res.send(location);
            } catch(err) {
                console.error(err);
            }
        });

        foursquareRes.on("error", (err) => {
            console.error(err);
        });
    });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
