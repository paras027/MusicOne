const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");


router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // req.user gets the user because of passport.authenticate
    const { name, thumbnail, track } = req.body;   // stores the data from input
    if (!name || !thumbnail || !track) {   //if anything is missing in data return error
        return res
            .status(301)
            .json({ err: "Insufficient details to create song." });
    }


    //else we will store values of the input given by user for request
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };

    //created a new song DB
    const createdSong = await Song.create(songDetails);
    //on successful creation we return status of 200 with that data
    return res.status(200).json(createdSong);
});

router.get("/get/mysongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const currUser = req.user;
    //we need to get all songs where artist id === currentuser.id
    const songs = await Song.find({ artist: currUser._id });
    return res.status(200).json({ data: songs });
});

//Get route to get all songs any artis has published
// I will send the artist id and i want see all songs by that artist
router.get(
    "/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistId } = req.params;
        const artist = await User.find({ _id: artistId });
        if (!artist) {
            return res.status(301).json({ err: "Artist does not exist" });
        }
        const songs = await Song.find({ artist: artistId });
        return res.status(200).json({ data: songs });
    }
);

router.get(
    "/get/name/:songname",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songname } = req.params;
        const songs = await Song.find({ name: songname });
        const songsByArtist = await Song.find({ artist: songname });
        if (!songs && !songsByArtist) {
            return res.status(301).json({ err: "Artist does not exist" });
        }
        else if (songs) {
            return res.status(200).json({ data: songs });
        }
        else {
            return res.status(200).json({ data: songsByArtist });
        }

    }
);
module.exports = router;