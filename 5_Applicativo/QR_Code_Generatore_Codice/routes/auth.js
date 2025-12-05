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

    //Cerca l'utente nel database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).render("login", {title: "Login", errorU: "Invalid username"});
    }

    //Confronta la password inserita con quella hashata
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).render("login", {title: "Login", errorP: "Invalid password"});
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

    //Controllo se l'utente eseste già
    const userexist = await User.findOne({ username });
    if(userexist){
        return res.status(400).render("create_account", {title: "Create Account", errorU: "username not available"});
    }

    //Controllo se la password è almeno di 8 cartteri
    if(password.length < 8){
        return res.status(400).render("create_account", {title: "Create Account", errorP: "password must contain at least 8 characters"});
    }

    //Criptazione password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Salvataggio utente nel DB con password criptata
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    //login automatico dopo la creazione
    const user = await User.findOne({ username });

    req.session.userId = user.id;
    req.session.username = user.username;

    res.redirect("/?msg=Creation%20succesfull");
})

module.exports = router;