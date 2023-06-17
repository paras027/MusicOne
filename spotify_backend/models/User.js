const mongoose = require("mongoose");
//How to create a model
//step1- require mongoose
//step2 - Create mongoose schema(structure of user)

const User = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    likedSongs: {
        type: String,
        default: "",
    },
    likedPlaylists: {
        type: String,
        default: "",
    },
    subscribedArtists: {
        type: String,
        default: "",
    },
});

User.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
    }
});
//step3 - Create Model
const UserModel = mongoose.model("User", User);

module.exports = UserModel;