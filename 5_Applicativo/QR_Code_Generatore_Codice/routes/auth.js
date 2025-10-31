const express = require("express");
const User = require("../models/users");
const { requireAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/login", (req, res) => {
    const { msg } = req.query;
    res.render("login", { title: "Login", msg });
});

router.post("/login", async(req, res) => {
    const { username, password } = req.body;

    // 1️⃣ Cerca l'utente nel database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).render("login", {title: "Login", errorU: "Invalid username"});
    }

    // 2️⃣ Confronta la password inserita con quella hashata
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).render("login", {title: "Login", errorP: "Invalid password"});
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect("/?msg=Login%20succesfull");
})

router.post("/logout", requireAuth, (req, res) => {
    req.session = null;
    res.redirect("/?msg=logged%20out");
})

router.get("/create_account", (req, res) => {
    res.render("create_account", { title: "Create Account"});
})

router.post("/create_account", async(req, res) => {
    const { username, password} = req.body;

    const userexist = await User.findOne({ username });
    if(userexist){
        return res.status(404).render("create_account", {title: "Create Account", errorU: "username not available"});
    }

    if(password.length < 8){
        return res.status(404).render("create_account", {title: "Create Account", errorP: "password must contain at least 8 characters"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const user = await User.findOne({ username });

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect("/?msg=Creation%20succesfull");
})

module.exports = router;