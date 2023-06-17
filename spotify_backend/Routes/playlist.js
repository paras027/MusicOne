const express = require("express");
const router = express.Router();
const passport = require("passport");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");

//1: create Playlist
router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // req.user gets the user because of passport.authenticate
    const { name, thumbnail, songs } = req.body;   // stores the data from input
    if (!name || !thumbnail || !songs) {   //if anything is missing in data return error
        return res.status(301).json({ err: "Insufficient details to create song." });
    }


    //else we will store values of the input given by user for request
    const currentuser = req.user;
    const PlaylistData = { name, thumbnail, songs, owner: currentuser._id, collaborators: [] };
    const Pla = await Playlist.create(PlaylistData);
    return res.status(200).json(Pla);
});

//2: Get Playlist by id

router.get(
    "/get/playlist/:playlistId", // : means plalistId is variable
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const playlistId = req.params.playlistId;
        const list = await Playlist.findOne({ _id: playlistId });
        if (!list) {
            return res.status(301).json({ err: "Artist does not exist" });
        }

        return res.status(200).json({ list });
    }
);

//3: Get Playlist by artist
router.get(
    "/get/artist/:artistId", // : means plalistId is variable
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const artist = req.params.artistId;
        const list = await Playlist.find({ owner: artist });
        return res.status(200).json({ data: list });
    }
);

router.post(
    "/add/songs", // : means plalistId is variable
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const curr = req.user;
        const { playli, songId } = req.body;
        const playlist = await Playlist.findOne({ _id: playli });
        if (!playlist) {
            return res.status(304).json({ err: "Playlist doesnt exist" });
        }

        if (!playlist.owner.equals(curr._id) && !playlist.collaborators.includes(curr._id)) {
            return res.status(400).json({ err: "Not Allowed" });
        }

        const song = await Song.findOne({ _id: songId });
        if (!song) {
            return res.status(304).json({ err: "Song does not exist" });
        }

        playlist.songs.push(songId);
        await playlist.save();
        return res.status(200).json(playlist);
    }
);

module.exports = router;

