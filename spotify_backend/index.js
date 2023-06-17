//npm init - this is a node project
//npm i express - installs express
//using express

const express = require("express");
const mongoose = require("mongoose");
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const Song = require("./Routes/song");
const authRoutes = require("./Routes/auth");
const Playlistt = require("./Routes/playlist");
const cors = require("cors");


require("dotenv").config();
//if we want to make something like password private then we can write it in an env file and save it
const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());
const val = process.env.Pass;
// connect mongoDb to our node app
// mongoose.connect() takes 2 arguments : 
// 1) Which db to connect (db url)
// 2) Connection options

mongoose.connect("mongodb+srv://paras:" + val + "@cluster0.jwftegb.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then((x) => {
    console.log("Connected to Mongo!");
}).catch((err) => {
    console.log("Error connecting to Mongo");
});

//setup passport jwt

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "asdasda";
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findOne({ id: jwt_payload.sub });
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
        // or you could create a new account
    }
})
);

app.get("/", (req, res) => {
    //req contains all data for request
    //res contains all data for response
    res.send("Hello World");
});

app.use("/auth", authRoutes);
app.use("/song", Song);
app.use("/playlist", Playlistt);
//Now we will tell express that our server will ru on localhost:8000
app.listen(port, () => {
    console.log("App is running on port: " + port);
});