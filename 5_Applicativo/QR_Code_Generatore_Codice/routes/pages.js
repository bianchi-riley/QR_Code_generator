const express = require("express");
const router = express.Router();
const User = require("./models/users");

router.get("/", (req, res) => {
    const { msg } = req.query;
    res.render("home", { title: "Home", msg});
});



module.exports = router;