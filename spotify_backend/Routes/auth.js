const express = require("express"); //to use express call this
const User = require("../models/User"); //imported user model
const bcrypt = require("bcrypt");  //bcrypt is used to convert passw into hash code for security
const router = express.Router();  //used router function to avoid extra functions provided by express()
const { getToken } = require("../utils/helpers"); //imported getToen function

// if user get to /register route he willl be able to signup
router.post("/register", async (req, res) => {
    // we are storing data in email,pass etc from the values added by user through req.body
    const { email, password, firstname, lastname, username } = req.body;

    // getting the user with same email
    const user = await User.findOne({ email: email });
    if (user) {   // if we get it then return already existed
        return res.status(403).json({ error: "A user already exists" });
    }


    // we do not store passwords in plain text due to security reasonss
    //we convert plain text to hash which will convert the password like 'xyz' into alot of characters
    const hassPass = await bcrypt.hash(password, 10);
    // creating new user data in DB
    const newUserData = { email, password: hassPass, firstname, lastname, username };
    const newUser = await User.create(newUserData);

    //step 4: we want to create the token to return to user
    const token = await getToken(email, newUser);

    // step 5: return result to user
    const userToReturn = { ...newUser.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
    //1: Get email and password sent by user from req.body
    const { email, password } = req.body;
    //2: Check if a user with the given email exists. If not, the credentials are invalid.
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(403).json({ error: "Invalid credentials" });
    }

    //comparing normal password with hashcode password we use bcrypt.compare
    const isPass = await bcrypt.compare(password, user.password);
    if (!isPass) {
        return res.status(403).json({ error: "Invalid credentials" });
    }

    const token = await getToken(user.email, user);
    const userToReturn = { ...user.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);

})
module.exports = router;