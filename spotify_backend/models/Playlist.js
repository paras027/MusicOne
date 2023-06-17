const mongoose = require("mongoose");
//How to create a model
//step1- require mongoose
//step2 - Create mongoose schema(structure of user)

const Playlist = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    //Playlist Songs
    //Playlist Collaborators
    songs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "song",
        },
    ],
    collaborators: [
        {
            type: mongoose.Types.ObjectId,
            ref: "user",
        }
    ]
});

//step3 - Create Model
const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;