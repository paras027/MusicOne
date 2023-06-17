const mongoose = require("mongoose");
//How to create a model
//step1- require mongoose
//step2 - Create mongoose schema(structure of user)

const Song = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    track: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
});

//step3 - Create Model
const SongModel = mongoose.model("Song", Song);

module.exports = SongModel;